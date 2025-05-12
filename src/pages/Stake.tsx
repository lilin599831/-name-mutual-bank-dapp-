import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useStaking } from '../hooks/useStaking';
import { useToken } from '../hooks/useToken';
import { useNotification } from '../contexts/NotificationContext';
import { useReferrer } from '../hooks/useReferrer';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { useTransaction } from '../contexts/TransactionContext';
import { AnimatedContainer } from '../components/AnimatedContainer';
import { validateForm, ValidationRules } from '../utils/validation';
import { useStakes } from '../hooks/useStakes';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { useUserInfo } from '../hooks/useUserInfo';
import { useContract } from '../hooks/useContract';
import { MUTUAL_BANK_ABI } from '../contracts/StakeABI';
import { GENESIS_REFERRER } from '../config/contracts';
import { formatTokenAmount } from '../utils/format';
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt';

const gradientText = `
  background: linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StakeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const StakeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  color: #fff;
  margin: 0 0 20px;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 10px 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StakesList = styled.div`
  margin-top: 20px;
`;

const StakeItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StakeInfo = styled.div`
  flex: 1;
`;

const StakeAmount = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StakeDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WithdrawButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const WithdrawInfo = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const ReferrerStatus = styled.div<{ $active: boolean }>`
  color: ${props => props.$active ? '#2ecc71' : '#e74c3c'};
  font-size: 14px;
  margin-top: 5px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border: none;
  color: white;
  
  &:hover {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    opacity: 0.9;
  }
  
  &:disabled {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    opacity: 0.5;
  }
`;

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message: string;
  min?: number;
  minMessage?: string;
}

const validationRules: ValidationRules = {
  amount: {
    required: true,
    pattern: /^\d+(\.\d{1,18})?$/,
    min: 100,
    message: '请输入有效的数字，最小质押数量为100 MBT'
  },
  referrer: {
    required: false,
    pattern: /^0x[a-fA-F0-9]{40}$/,
    message: '请输入有效的推荐人地址'
  }
};

export const Stake: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { stake, withdraw, claimRewards, loading: stakingLoading } = useStaking();
  const { getBalance, loading: tokenLoading } = useToken();
  const { showNotification } = useNotification();
  const { stakes, loading: stakesLoading, refresh: refreshStakes, totalPendingRewards } = useStakes();
  const { referrer, hasReferrer, loading: referrerLoading, fetchReferrer } = useReferrer();
  const { userInfo, loading: userInfoLoading } = useUserInfo();
  const { getContract } = useContract(MUTUAL_BANK_ABI);
  const [amount, setAmount] = useState('');
  const [referrerAddress, setReferrerAddress] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refAddress = urlParams.get('ref');
    console.log('初始化时获取推荐人地址:', refAddress);
    if (refAddress && ethers.utils.isAddress(refAddress)) {
      console.log('设置初始推荐人地址:', refAddress);
      return refAddress;
    }
    return '';
  });
  const [balance, setBalance] = useState('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState<number | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReferrerActive, setIsReferrerActive] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refAddress = urlParams.get('ref');
    console.log('URL 变化，获取推荐人地址:', refAddress);
    
    if (refAddress && ethers.utils.isAddress(refAddress)) {
      console.log('设置新的推荐人地址:', refAddress);
      setReferrerAddress(refAddress);
    }
  }, [window.location.search]);

  useEffect(() => {
    console.log('推荐人地址状态变化:', { referrerAddress, hasReferrer });
  }, [referrerAddress, hasReferrer]);

  useEffect(() => {
    console.log('钱包连接状态变化:', { isConnected, account });
    if (isConnected && account) {
      console.log('触发获取推荐人信息');
      fetchReferrer();
    }
  }, [isConnected, account, fetchReferrer]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getBalance(account);
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [account, getBalance]);

  // 检查推荐人状态
  const checkReferrerStatus = async (address: string) => {
    if (!address || !ethers.utils.isAddress(address)) {
      console.log('无效的推荐人地址:', address);
      setIsReferrerActive(false);
      return;
    }

    try {
      const contract = getContract();
      if (!contract) {
        console.log('获取合约实例失败');
        return;
      }

      console.log('开始检查推荐人状态:', address);
      const userInfo = await contract.getUserInfo(address);
      console.log('推荐人信息:', userInfo);
      
      // 检查用户是否有活跃的质押
      const stakes = await contract.getUserStakes(address);
      const hasActiveStakes = stakes.some((stake: any) => stake.active);
      console.log('推荐人是否有活跃质押:', hasActiveStakes);
      
      setIsReferrerActive(hasActiveStakes);
    } catch (err) {
      console.error('检查推荐人状态失败:', err);
      setIsReferrerActive(false);
    }
  };

  useEffect(() => {
    if (referrerAddress) {
      checkReferrerStatus(referrerAddress);
    }
  }, [referrerAddress]);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('质押状态:', {
      hasReferrer,
      referrerAddress,
      isReferrerActive,
      userInfo: userInfo?.referrer
    });

    const validationErrors = validateForm({ amount, referrer: referrerAddress }, validationRules);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showNotification('error', '请检查输入');
      return;
    }

    if (Number(amount) < 100) {
      showNotification('error', '最小质押数量为100 MBT');
      return;
    }

    if (Number(amount) > Number(balance)) {
      showNotification('error', '余额不足');
      return;
    }

    if (referrerAddress && referrerAddress.toLowerCase() === account?.toLowerCase()) {
      showNotification('error', '不能将自己设置为推荐人');
      return;
    }

    // 检查用户是否已有推荐人
    const hasExistingReferrer = userInfo?.referrer && userInfo.referrer !== ethers.constants.AddressZero;
    console.log('用户推荐人状态:', {
      hasExistingReferrer,
      referrer: userInfo?.referrer
    });

    // 只在用户没有推荐人且正在设置新推荐人时检查推荐人状态
    if (!hasExistingReferrer && !referrerAddress) {
      showNotification('error', '请输入推荐人地址');
      return;
    }

    setIsStaking(true);
    try {
      // 如果用户已有推荐人，使用现有推荐人地址；否则使用新输入的推荐人地址
      const finalReferrer = hasExistingReferrer ? userInfo?.referrer : referrerAddress;
      console.log('最终使用的推荐人地址:', finalReferrer);
      
      const success = await stake(amount, finalReferrer, {
        onApproving: () => {
          setIsApproving(true);
        },
        onStaking: () => {
          setIsApproving(false);
        }
      });
      if (success) {
        showNotification('success', '质押成功');
        setAmount('');
        setReferrerAddress('');
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', '用户取消质押');
      } else {
        showNotification('error', error.message || '质押失败');
      }
    } finally {
      setIsStaking(false);
      setIsApproving(false);
    }
  };

  const handleWithdraw = async (stakeIndex: number) => {
    setIsWithdrawing(stakeIndex);
    try {
      const success = await withdraw(stakeIndex);
      if (success) {
        showNotification('success', '提取成功');
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', '用户取消提取');
      } else {
        showNotification('error', error.message || '提取失败');
      }
    } finally {
      setIsWithdrawing(null);
    }
  };

  const handleClaimRewards = async () => {
    setIsClaiming(true);
    try {
      const success = await claimRewards();
      if (success) {
        showNotification('success', '领取收益成功');
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', '用户取消领取');
      } else {
        showNotification('error', error.message || '领取收益失败');
      }
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isConnected) {
    return (
      <AnimatedContainer animation="fadeIn">
        <ConnectWalletPrompt 
          title="质押中心"
          description="连接钱包后即可开始质押您的代币，获取稳定收益。"
        />
      </AnimatedContainer>
    );
  }

  return (
    <StakeContainer>
      <AnimatedContainer animation="scaleIn">
        <StakeCard>
          <Title>质押代币</Title>
          <Form onSubmit={handleStake}>
            <Input
              label="质押数量"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors({});
              }}
              placeholder="输入质押数量"
              error={errors.amount}
              fullWidth
              disabled={isStaking || isWithdrawing !== null || isClaiming}
            />
            {!hasReferrer && (
              <>
                <Input
                  label="推荐人地址"
                  type="text"
                  value={referrerAddress}
                  onChange={(e) => {
                    setReferrerAddress(e.target.value);
                    setErrors({});
                  }}
                  placeholder="输入推荐人钱包地址"
                  error={errors.referrer}
                  fullWidth
                  disabled={isStaking || isWithdrawing !== null || isClaiming}
                />
                {referrerAddress && (
                  <>
                    <InfoText>当前推荐人地址: {referrerAddress}</InfoText>
                    <ReferrerStatus $active={Boolean(isReferrerActive)}>
                      {isReferrerActive ? '推荐人状态：活跃' : '推荐人状态：不活跃'}
                    </ReferrerStatus>
                  </>
                )}
              </>
            )}
            <InfoText>可用余额: {formatTokenAmount(balance)} MBT</InfoText>
            <ButtonGroup>
              <Button
                type="submit"
                variant="primary"
                loading={isStaking}
                disabled={isWithdrawing !== null || isClaiming}
                fullWidth
              >
                质押
              </Button>
            </ButtonGroup>
          </Form>
        </StakeCard>

        <StakeCard>
          <Title>收益管理</Title>
          <InfoText>可领取总收益: {formatTokenAmount(totalPendingRewards)} MBT</InfoText>
          <ButtonGroup>
            <Button
              type="button"
              variant="primary"
              onClick={handleClaimRewards}
              loading={isClaiming}
              disabled={isStaking || isWithdrawing !== null}
              fullWidth
            >
              领取所有收益
            </Button>
          </ButtonGroup>
        </StakeCard>

        {stakes.length > 0 && (
          <StakeCard>
            <Title>我的质押</Title>
            <StakesList>
              {stakes.map((stake, index) => (
                <StakeItem key={index}>
                  <StakeInfo>
                    <StakeAmount>{formatTokenAmount(stake.amount)} MBT</StakeAmount>
                    <StakeDetails>
                      <div>质押时间: {new Date(stake.startTime * 1000).toLocaleString()}</div>
                      <div>质押利率: {stake.rate}%</div>
                      <div>待领取收益: {formatTokenAmount(stake.pendingRewards)} MBT</div>
                      <div>手续费: {formatTokenAmount(stake.withdrawFee)} MBT</div>
                    </StakeDetails>
                  </StakeInfo>
                  <WithdrawButton
                    variant="primary"
                    onClick={() => handleWithdraw(index)}
                    loading={isWithdrawing === index}
                    disabled={isStaking || isClaiming}
                  >
                    提取
                    <WithdrawInfo>手续费: {formatTokenAmount(stake.withdrawFee)} MBT</WithdrawInfo>
                  </WithdrawButton>
                </StakeItem>
              ))}
            </StakesList>
          </StakeCard>
        )}
      </AnimatedContainer>
    </StakeContainer>
  );
};

export default Stake; 