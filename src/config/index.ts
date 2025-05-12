export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x...';

// 质押代币合约地址
export const STAKE_TOKEN_ADDRESS = process.env.REACT_APP_STAKE_TOKEN_ADDRESS || process.env.REACT_APP_TOKEN_ADDRESS || '';

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  SEPOLIA: 11155111
};

export const MIN_STAKE_AMOUNT = '100';

export const NETWORK_CONFIG = {
  [SUPPORTED_CHAINS.MAINNET]: {
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.REACT_APP_MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/your-api-key',
    explorer: 'https://etherscan.io'
  },
  [SUPPORTED_CHAINS.SEPOLIA]: {
    name: 'Sepolia Testnet',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL || '',
    explorer: 'https://sepolia.etherscan.io'
  }
};

export const DEFAULT_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID) || SUPPORTED_CHAINS.SEPOLIA; 