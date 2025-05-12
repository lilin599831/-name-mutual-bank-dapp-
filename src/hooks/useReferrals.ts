import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { MUTUAL_BANK_ABI } from '../contracts/StakeABI';
import { ethers } from 'ethers';

export interface Referral {
  address: string;
  amount: string;
  startTime: number;
  lastClaimTime: number;
  rate: number;
  active: boolean;
}

export const useReferrals = (account: string | null) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalReferred, setTotalReferred] = useState('0');
  const [referralRate, setReferralRate] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getContract } = useContract(MUTUAL_BANK_ABI);

  const fetchReferrals = async () => {
    if (!account) return;

    try {
      setLoading(true);
      setError(null);
      const contract = getContract();
      if (!contract) return;

      const [userInfo, referralList] = await Promise.all([
        contract.getUserInfo(account),
        contract.getReferralList(account)
      ]);

      const { currentReferralRate } = userInfo;
      const rateInPercent = (Number(currentReferralRate) / 10000).toFixed(2);
      setReferralRate(rateInPercent);

      const referralData = await Promise.all(
        referralList.map(async (address: string) => {
          const stakes = await contract.getUserStakes(address);
          const activeStakes = stakes.filter((stake: any) => stake.active);
          const totalAmount = activeStakes.reduce(
            (sum: ethers.BigNumber, stake: any) => sum.add(stake.amount),
            ethers.BigNumber.from(0)
          );

          return {
            address,
            amount: ethers.utils.formatEther(totalAmount),
            startTime: activeStakes[0]?.startTime.toNumber() || 0,
            lastClaimTime: activeStakes[0]?.lastClaimTime.toNumber() || 0,
            rate: activeStakes[0]?.rate || 0,
            active: activeStakes[0]?.active || false
          };
        })
      );

      setReferrals(referralData);
      setTotalReferred(ethers.utils.formatEther(
        referralData.reduce(
          (sum, ref) => sum.add(ethers.utils.parseEther(ref.amount)),
          ethers.BigNumber.from(0)
        )
      ));
    } catch (err) {
      console.error('获取推荐信息失败:', err);
      setError(err instanceof Error ? err.message : '获取推荐信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchReferrals();
    }
  }, [account]);

  return {
    referrals,
    totalReferred,
    referralRate,
    loading,
    error,
    fetchReferrals
  };
}; 