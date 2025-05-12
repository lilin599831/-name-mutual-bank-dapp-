// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMintableBurnable {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}

contract MutualBank is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    
    uint256 public constant FEE_PRECISION = 1e6;
    uint256 public constant SECONDS_PER_DAY = 86400;
    uint256 public constant MIN_STAKE = 100 ether;
    uint256 public constant WITHDRAW_FEE_INITIAL = 100_000; 
    uint256 public constant FEE_DECAY_PERIOD = 100 days;
    
    struct RateConfig {
        uint256 threshold;
        uint256 rate;
    }
    
    RateConfig[] public stakingRateConfig;
    RateConfig[] public referralRateConfig;
    
    uint256 public totalStaked;
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint16 rate;
        bool active;
    }

    struct UserInfo {
        Stake[] stakes;
        address referrer;
        uint256 totalStaked;
        uint256 totalReferredStaked;
        mapping(uint256 => bool) stakeActive;
    }

    mapping(address => UserInfo) private _users;
    mapping(address => bool) public hasReferrer;
    mapping(address => address[]) public referrals;

    event Staked(address indexed user, uint256 amount, uint256 rate, uint256 stakeIndex);
    event Withdrawn(address indexed user, uint256 amount, uint256 fee, uint256 stakeIndex);
    event RewardClaimed(address indexed user, uint256 reward);
    event ReferralRewardPaid(address indexed referrer, address indexed user, uint256 reward);
    event ReferrerUpdated(address indexed user, address indexed referrer);
    event RatesUpdated(string rateType);

    constructor(IMintableBurnable _token, address initialOwner) Ownable(initialOwner) {
        stakingToken = IERC20(address(_token));
        
        stakingRateConfig.push(RateConfig({threshold: 0, rate: 700}));
        stakingRateConfig.push(RateConfig({threshold: 500 ether, rate: 770}));
        stakingRateConfig.push(RateConfig({threshold: 1_000 ether, rate: 840}));
        stakingRateConfig.push(RateConfig({threshold: 2_000 ether, rate: 910}));
        stakingRateConfig.push(RateConfig({threshold: 4_000 ether, rate: 980}));
        stakingRateConfig.push(RateConfig({threshold: 8_000 ether, rate: 1_050}));
        stakingRateConfig.push(RateConfig({threshold: 15_000 ether, rate: 1_120}));
        stakingRateConfig.push(RateConfig({threshold: 30_000 ether, rate: 1_190}));
        stakingRateConfig.push(RateConfig({threshold: 50_000 ether, rate: 1_260}));
        
        referralRateConfig.push(RateConfig({threshold: 0, rate: 200_000}));
        referralRateConfig.push(RateConfig({threshold: 1_500 ether, rate: 210_000}));
        referralRateConfig.push(RateConfig({threshold: 3_000 ether, rate: 230_000}));
        referralRateConfig.push(RateConfig({threshold: 6_000 ether, rate: 260_000}));
        referralRateConfig.push(RateConfig({threshold: 12_000 ether, rate: 300_000}));
        referralRateConfig.push(RateConfig({threshold: 24_000 ether, rate: 350_000}));
        referralRateConfig.push(RateConfig({threshold: 45_000 ether, rate: 410_000}));
        referralRateConfig.push(RateConfig({threshold: 90_000 ether, rate: 480_000}));
        referralRateConfig.push(RateConfig({threshold: 150_000 ether, rate: 560_000}));
    }

    function stake(uint256 amount, address referrer) external nonReentrant {
        require(amount >= MIN_STAKE, "Minimum stake not met");
        
        UserInfo storage user = _users[msg.sender];
        uint256 balanceBefore = stakingToken.balanceOf(address(this));
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 actualReceived = stakingToken.balanceOf(address(this)) - balanceBefore;
        
        user.totalStaked += actualReceived;
        totalStaked += actualReceived;
        
        _handleReferrer(user, referrer, actualReceived);
        
        uint256 newRate = _getStakingRate(user.totalStaked);

        uint256 stakeIndex = user.stakes.length;
        user.stakes.push(Stake({
            amount: actualReceived,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            rate: uint16(newRate),
            active: true
        }));
        user.stakeActive[stakeIndex] = true;

        emit Staked(msg.sender, actualReceived, newRate, stakeIndex);
    }

    function withdraw(uint256 stakeIndex) external nonReentrant {
        UserInfo storage user = _users[msg.sender];
        require(stakeIndex < user.stakes.length, "Invalid stake index");
        require(user.stakeActive[stakeIndex], "Stake not active");

        Stake storage s = user.stakes[stakeIndex];
        uint256 stakingDuration = block.timestamp - s.startTime;

        uint256 feeRatio = _calculateFeeRatio(stakingDuration);
        uint256 fee = (s.amount * feeRatio) / FEE_PRECISION;
        uint256 principal = s.amount - fee;

        uint256 reward = _calculateReward(s);

        if (reward > 0 && user.referrer != address(0)) {
            _handleReferralReward(user.referrer, msg.sender, reward);
        }

        s.active = false;
        user.stakeActive[stakeIndex] = false;
        user.totalStaked -= s.amount;
        totalStaked -= s.amount;

        if (user.referrer != address(0)) {
            _users[user.referrer].totalReferredStaked -= s.amount;
        }

        stakingToken.safeTransfer(msg.sender, principal);

        if (reward > 0) {
            IMintableBurnable(address(stakingToken)).mint(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }

        if (fee > 0) {
            IMintableBurnable(address(stakingToken)).burn(fee);
        }

        emit Withdrawn(msg.sender, principal, fee, stakeIndex);
    }

    function claimAllRewards() external nonReentrant {
        UserInfo storage user = _users[msg.sender];
        uint256 totalReward;

        for (uint256 i = 0; i < user.stakes.length; i++) {
            if (!user.stakeActive[i]) continue;

            Stake storage s = user.stakes[i];
            uint256 reward = _calculateReward(s);
            
            if (reward > 0) {
                totalReward += reward;
                s.lastClaimTime = block.timestamp;
            }
        }

        require(totalReward > 0, "No rewards available");
        IMintableBurnable(address(stakingToken)).mint(msg.sender, totalReward);
        emit RewardClaimed(msg.sender, totalReward);
        
        _handleReferralReward(user.referrer, msg.sender, totalReward);
    }

    function updateStakingRates(RateConfig[] calldata newRates) external onlyOwner {
        delete stakingRateConfig;
        for (uint256 i = 0; i < newRates.length; i++) {
            stakingRateConfig.push(newRates[i]);
        }
        emit RatesUpdated("Staking");
    }

    function updateReferralRates(RateConfig[] calldata newRates) external onlyOwner {
        delete referralRateConfig;
        for (uint256 i = 0; i < newRates.length; i++) {
            referralRateConfig.push(newRates[i]);
        }
        emit RatesUpdated("Referral");
    }

    function _handleReferrer(UserInfo storage user, address referrer, uint256 amount) internal {
        if (!hasReferrer[msg.sender] && referrer != address(0)) {
            require(referrer != msg.sender, "Self-referral prohibited");
            require(referrer != address(0), "Invalid referrer address");
            require(_users[referrer].totalStaked > 0, "Referrer not active");

            user.referrer = referrer;
            hasReferrer[msg.sender] = true;
            _users[referrer].totalReferredStaked += amount;
            referrals[referrer].push(msg.sender);
            emit ReferrerUpdated(msg.sender, referrer);
        } else if (user.referrer != address(0)) {
            _users[user.referrer].totalReferredStaked += amount;
        }
    }

    function _calculateFeeRatio(uint256 duration) internal pure returns (uint256) {
        return duration >= FEE_DECAY_PERIOD ? 0 : 
            (WITHDRAW_FEE_INITIAL * (FEE_DECAY_PERIOD - duration)) / FEE_DECAY_PERIOD;
    }

    function _calculateReward(Stake storage s) internal view returns (uint256) {
        uint256 elapsed = block.timestamp - s.lastClaimTime;
        return (s.amount * uint256(s.rate) * elapsed) / (FEE_PRECISION * SECONDS_PER_DAY);
    }

    function _getStakingRate(uint256 total) internal view returns (uint256) {
        for (uint256 i = stakingRateConfig.length; i > 0; i--) {
            if (total >= stakingRateConfig[i - 1].threshold) {
                return stakingRateConfig[i - 1].rate;
            }
        }
        return stakingRateConfig[0].rate;
    }

    function _handleReferralReward(address referrer, address user, uint256 reward) internal {
        if (referrer != address(0)) { 
            UserInfo storage referrerInfo = _users[referrer];
            UserInfo storage userInfo = _users[user];
            
            if (referrerInfo.totalStaked >= userInfo.totalStaked) {
                uint256 refRate = _getReferralRate(referrerInfo.totalReferredStaked);
                uint256 refReward = (reward * refRate) / FEE_PRECISION;
                
                if (refReward > 0) {
                    IMintableBurnable(address(stakingToken)).mint(referrer, refReward);
                    emit ReferralRewardPaid(referrer, user, refReward);
                }
            }
        }
    }

    function _getReferralRate(uint256 total) internal view returns (uint256) {
        for (uint256 i = referralRateConfig.length; i > 0; i--) {
            if (total >= referralRateConfig[i - 1].threshold) {
                return referralRateConfig[i - 1].rate;
            }
        }
        return referralRateConfig[0].rate;
    }

    function getUserStakes(address user) external view returns (Stake[] memory) {
        return _users[user].stakes;
    }

    function getUserInfo(address user) external view returns (
        uint256 userTotalStaked,
        address referrer,
        uint256 totalReferred,
        uint256 currentStakingRate,
        uint256 currentReferralRate
    ) {
        UserInfo storage u = _users[user];
        return (
            u.totalStaked,
            u.referrer,
            u.totalReferredStaked,
            _getStakingRate(u.totalStaked),
            _getReferralRate(u.totalReferredStaked)
        );
    }

    function getReferralList(address user) external view returns (address[] memory) {
        return referrals[user];
    }

    function getGlobalStats() external view returns (
        uint256 globalTotalStaked,
        uint256 stakingConfigCount,
        uint256 referralConfigCount
    ) {
        return (
            totalStaked,
            stakingRateConfig.length,
            referralRateConfig.length
        );
    }
} 