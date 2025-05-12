export const CONTRACT_ADDRESS = '0x...'; // 部署后替换为实际地址

export const ERC20_ABI = [
	'function approve(address spender, uint256 amount) public returns (bool)',
	'function allowance(address owner, address spender) public view returns (uint256)',
	'function balanceOf(address account) public view returns (uint256)',
	'function decimals() public view returns (uint8)',
	'function transfer(address to, uint256 amount) public returns (bool)',
	'function transferFrom(address from, address to, uint256 amount) public returns (bool)'
];

export const MUTUAL_BANK_ABI = [
	'function getUserInfo(address user) public view returns (uint256, address, uint256, uint256, uint256)',
	'function stake(uint256 amount) public',
	'function unstake(uint256 amount) public',
	'function claimRewards() public',
	'function getStakingRate() public view returns (uint256)',
	'function getReferralRate() public view returns (uint256)'
];

export const MUTUAL_BANK_ABI_OLD = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "stakeIndex",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimAllRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserStakes",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastClaimTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct MutualBank.Stake[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "userTotalStaked",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalReferred",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentStakingRate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentReferralRate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; 