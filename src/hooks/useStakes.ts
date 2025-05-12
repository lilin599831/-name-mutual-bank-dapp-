import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getMutualBankContract } from '../utils/contract';
import { ethers } from 'ethers';

export interface Stake {
  amount: string;
  startTime: number;
  lastClaimTime: number;
  rate: string;
  active: boolean;
  index: number;
  pendingRewards: string;
  withdrawFee: string;
}

// 手续费计算相关常量
const FEE_PRECISION = 1e6;
const WITHDRAW_FEE_INITIAL = 100_000; // 10%
const FEE_DECAY_PERIOD = 100 * 24 * 60 * 60; // 100 days in seconds

export const useStakes = () => {
  const { provider, account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [totalPendingRewards, setTotalPendingRewards] = useState('0');

  const calculateWithdrawFee = (amount: string, startTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const duration = now - startTime;
    
    // 计算手续费率
    let feeRatio = 0;
    if (duration < FEE_DECAY_PERIOD) {
      feeRatio = (WITHDRAW_FEE_INITIAL * (FEE_DECAY_PERIOD - duration)) / FEE_DECAY_PERIOD;
    }
    
    // 计算手续费
    const fee = (Number(amount) * feeRatio) / FEE_PRECISION;
    return fee.toFixed(8);
  };

  const fetchStakes = useCallback(async () => {
    if (!provider || !account || !isConnected) return;

    try {
      setLoading(true);
      setError(null);
      const contract = getMutualBankContract(provider);
      
      // 获取用户的所有质押信息
      const stakesData = await contract.getUserStakes(account);
      
      // 格式化质押数据
      const formattedStakes = stakesData.map((stake: any, index: number) => {
        // 从合约中获取的利率是基点值（例如：126 表示 1.26%）
        const rateInPercent = (Number(stake.rate) / 10000).toFixed(3);
        
        // 计算该笔质押的待领取收益
        const timeElapsed = Math.floor(Date.now() / 1000) - stake.lastClaimTime.toNumber();
        const dailyRate = Number(rateInPercent) / 100; // 1.26% -> 0.0126
        const daysElapsed = timeElapsed / 86400; // 转换为天数
        const pendingRewards = (Number(ethers.utils.formatEther(stake.amount)) * dailyRate * daysElapsed).toFixed(8);
        
        // 计算提取手续费
        const amount = ethers.utils.formatEther(stake.amount);
        const withdrawFee = calculateWithdrawFee(amount, stake.startTime.toNumber());
        
        return {
          amount,
          startTime: stake.startTime.toNumber(),
          lastClaimTime: stake.lastClaimTime.toNumber(),
          rate: rateInPercent,
          active: stake.active,
          index: index,
          pendingRewards,
          withdrawFee
        };
      });

      // 计算总待领取收益
      const totalRewards = formattedStakes.reduce((total: number, stake: Stake) => {
        if (!stake.active) return total;
        return total + Number(stake.pendingRewards);
      }, 0);

      setTotalPendingRewards(totalRewards.toFixed(8));
      setStakes(formattedStakes);
    } catch (error) {
      console.error('获取质押信息失败:', error);
      setError(error instanceof Error ? error.message : '获取质押信息失败');
    } finally {
      setLoading(false);
    }
  }, [provider, account, isConnected]);

  useEffect(() => {
    if (isConnected && account) {
      fetchStakes();
    }
  }, [isConnected, account, fetchStakes]);

  return { stakes, loading, error, refresh: fetchStakes, totalPendingRewards };
}; 