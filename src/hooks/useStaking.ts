import { useState, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getMutualBankContract } from '../utils/contract';
import { ethers } from 'ethers';
import { TOKEN_ADDRESS } from '../config/contracts';

// ERC20 代币 ABI
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
  'event Approval(address indexed owner, address indexed spender, uint256 amount)'
];

interface StakeCallbacks {
  onApproving?: () => void;
  onStaking?: () => void;
}

export const useStaking = () => {
  const { signer } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const approve = useCallback(async (amount: string) => {
    if (!signer) {
      setError('请先连接钱包');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const contract = getMutualBankContract(signer);
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        ERC20_ABI,
        signer
      );

      const amountWei = ethers.utils.parseEther(amount);
      const tx = await tokenContract.approve(contract.address, amountWei);
      await tx.wait();
      return true;
    } catch (err: any) {
      console.error('授权失败:', err);
      if (err.code === 4001) {
        // 用户取消交易
        setError('用户取消授权');
      } else {
        setError(err.message || '授权失败');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer]);

  const stake = useCallback(async (amount: string, referrer: string = ethers.constants.AddressZero, callbacks?: StakeCallbacks) => {
    if (!signer) {
      setError('请先连接钱包');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const contract = getMutualBankContract(signer);
      const amountWei = ethers.utils.parseEther(amount);
      
      // 先检查授权额度
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        ERC20_ABI,
        signer
      );
      
      const allowance = await tokenContract.allowance(await signer.getAddress(), contract.address);
      if (allowance.lt(amountWei)) {
        console.log('需要授权代币');
        callbacks?.onApproving?.();
        const approved = await approve(amount);
        if (!approved) {
          return false;
        }
      }

      callbacks?.onStaking?.();
      const tx = await contract.stake(amountWei, referrer);
      await tx.wait();
      return true;
    } catch (err: any) {
      console.error('质押失败:', err);
      if (err.code === 4001) {
        // 用户取消交易
        setError('用户取消质押');
      } else {
        setError(err.message || '质押失败');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer, approve]);

  const withdraw = async (stakeIndex: number) => {
    if (!signer) {
      setError('请先连接钱包');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getMutualBankContract(signer);
      const tx = await contract.withdraw(stakeIndex);
      await tx.wait();
      return true;
    } catch (err: any) {
      console.error('提取失败:', err);
      if (err.code === 4001) {
        // 用户取消交易
        setError('用户取消提取');
      } else {
        setError(err.message || '提取失败');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async () => {
    if (!signer) {
      setError('请先连接钱包');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getMutualBankContract(signer);
      const tx = await contract.claimAllRewards();
      await tx.wait();
      return true;
    } catch (err: any) {
      console.error('领取收益失败:', err);
      if (err.code === 4001) {
        // 用户取消交易
        setError('用户取消领取');
      } else {
        setError(err.message || '领取收益失败');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    stake,
    withdraw,
    claimRewards,
    loading,
    error,
    clearError
  };
}; 