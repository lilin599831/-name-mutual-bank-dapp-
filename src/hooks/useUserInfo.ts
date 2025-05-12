import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getContract } from '../utils/contract';
import { MUTUAL_BANK_ABI_OLD, ERC20_ABI } from '../contracts/abi';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../config/contracts';
import { ethers } from 'ethers';

export interface UserInfo {
  totalStaked: string;      // 用户总质押量
  totalReferred: string;    // 推荐总质押量
  referrer: string;         // 推荐人地址
  stakingRate: string;      // 当前质押利率
  referralRate: string;     // 当前推荐利率
  lastClaimTime: number;
  activeStakes: number;
}

export const useUserInfo = () => {
  const { provider, account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  const fetchUserInfo = useCallback(async () => {
    if (!provider || !account || !isConnected) return;

    try {
      setLoading(true);
      setError(null);

      const contract = getContract(provider, CONTRACT_ADDRESS, MUTUAL_BANK_ABI_OLD);
      const tokenContract = getContract(provider, TOKEN_ADDRESS, ERC20_ABI);

      const [info, balance] = await Promise.all([
        contract.getUserInfo(account),
        tokenContract.balanceOf(account)
      ]);

      // 从合约返回的信息中获取所有相关数据
      const [userTotalStaked, referrer, totalReferred, currentStakingRate, currentReferralRate] = info;
      
      console.log('合约返回的利率数据:', {
        currentStakingRate: currentStakingRate.toString(),
        formattedRate: (Number(currentStakingRate) / 10000).toFixed(3)
      });

      setUserInfo({
        totalStaked: ethers.utils.formatEther(userTotalStaked),
        totalReferred: ethers.utils.formatEther(totalReferred),
        referrer: referrer,
        stakingRate: (Number(currentStakingRate) / 10000).toFixed(3),
        referralRate: (Number(currentReferralRate) / 10000).toFixed(2),
        lastClaimTime: Date.now(),
        activeStakes: 0
      });

      setTokenBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('获取用户信息失败:', err);
      setError(err instanceof Error ? err.message : '获取用户信息失败');
    } finally {
      setLoading(false);
    }
  }, [provider, account, isConnected]);

  useEffect(() => {
    if (isConnected && account) {
      fetchUserInfo();
    }
  }, [isConnected, account, fetchUserInfo]);

  return { userInfo, tokenBalance, loading, error, refresh: fetchUserInfo };
}; 