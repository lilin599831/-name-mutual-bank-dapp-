import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getMutualBankContract } from '../utils/contract';
import { ethers } from 'ethers';

export const useReferrer = () => {
  const { signer, account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<string>('');
  const [hasReferrer, setHasReferrer] = useState(false);

  const fetchReferrer = useCallback(async () => {
    console.log('开始获取推荐人信息:', { signer: !!signer, account, isConnected });
    
    if (!signer || !account || !isConnected) {
      console.log('跳过获取推荐人信息: 缺少必要参数');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const contract = getMutualBankContract(signer);
      
      console.log('调用合约 getUserInfo:', account);
      const [userTotalStaked, referrerAddress, totalReferred, currentStakingRate, currentReferralRate] = await contract.getUserInfo(account);
      
      console.log('合约返回的用户信息:', {
        userTotalStaked: userTotalStaked.toString(),
        referrerAddress,
        totalReferred: totalReferred.toString(),
        currentStakingRate: currentStakingRate.toString(),
        currentReferralRate: currentReferralRate.toString()
      });
      
      // 只有当用户确实有推荐人时才更新状态
      if (referrerAddress !== ethers.constants.AddressZero) {
        console.log('用户已有推荐人，更新状态:', referrerAddress);
        setReferrer(referrerAddress);
        setHasReferrer(true);
      } else {
        console.log('用户没有推荐人，重置状态');
        setReferrer('');
        setHasReferrer(false);
      }
    } catch (err) {
      console.error('获取推荐人信息失败:', err);
      setError(err instanceof Error ? err.message : '获取推荐人信息失败');
    } finally {
      setLoading(false);
    }
  }, [signer, account, isConnected]);

  // 监听钱包连接状态
  useEffect(() => {
    console.log('钱包连接状态变化:', { isConnected, account });
    
    if (isConnected && account) {
      console.log('触发获取推荐人信息');
      fetchReferrer();
    } else {
      console.log('重置推荐人状态');
      setReferrer('');
      setHasReferrer(false);
    }
  }, [isConnected, account, fetchReferrer]);

  // 在组件挂载时获取推荐人信息
  useEffect(() => {
    if (isConnected && account) {
      console.log('组件挂载时获取推荐人信息');
      fetchReferrer();
    }
  }, []); // 只在组件挂载时执行一次

  return {
    referrer,
    hasReferrer,
    loading,
    error,
    fetchReferrer
  };
}; 