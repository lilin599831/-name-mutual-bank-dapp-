import { ethers } from 'ethers';

export interface Stake {
  amount: string;
  startTime: Date;
  lastClaimTime: Date;
  rate: string;
  active: boolean;
}

export interface UserInfo {
  userTotalStaked: string;
  totalRewards: string;
  currentStakingRate: string;
  referrer: string;
  totalReferred: string;
  currentReferralRate: string;
}

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface Web3State {
  account: string;
  chainId: string;
  provider: ethers.providers.Web3Provider | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export interface Activity {
  type: string;
  amount: string;
  time: Date;
} 