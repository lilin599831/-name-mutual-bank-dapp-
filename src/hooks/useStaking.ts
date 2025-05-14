import { useState, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getMutualBankContract } from '../utils/contract';
import { ethers } from 'ethers';
import { TOKEN_ADDRESS } from '../config/contracts';
import { useContract } from './useContract';
import { MUTUAL_BANK_ABI } from '../contracts/abi';
import { useNotification } from '../contexts/NotificationContext';

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
  const { getContract } = useContract(MUTUAL_BANK_ABI);
  const { showNotification } = useNotification();

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

  const stake = useCallback(async (amount: string, referrer: string, callbacks?: {
    onApproving?: () => void;
    onStaking?: () => void;
  }): Promise<boolean> => {
    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('获取合约实例失败');
      }

      return true;
    } catch (error: any) {
      console.error('质押失败:', error);
      return false;
    }
  }, [getContract]);

  const withdraw = useCallback(async (stakeIndex: number): Promise<boolean> => {
    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('获取合约实例失败');
      }

      // 添加重试机制
      let retries = 3;
      let tx;
      
      while (retries > 0) {
        try {
          // 先检查质押状态
          const stakeInfo = await contract.getUserStakeInfo(await contract.signer.getAddress(), stakeIndex);
          console.log('质押信息:', stakeInfo);
          
          if (!stakeInfo.active) {
            throw new Error('质押不处于活跃状态');
          }

          // 执行赎回
          tx = await contract.withdraw(stakeIndex);
          console.log('赎回交易已发送:', tx.hash);
          break;
        } catch (err: any) {
          console.error('赎回尝试失败:', err);
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!tx) {
        throw new Error('赎回交易发送失败');
      }

      // 等待交易确认
      const receipt = await tx.wait();
      console.log('赎回交易已确认:', receipt);

      return true;
    } catch (error: any) {
      console.error('赎回失败:', error);
      if (error.message.includes('Stake not active')) {
        showNotification('error', '该质押已被赎回或不处于活跃状态');
      } else {
        showNotification('error', error.message || '赎回失败');
      }
      return false;
    }
  }, [getContract, showNotification]);

  const claimRewards = useCallback(async (): Promise<boolean> => {
    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('获取合约实例失败');
      }

      // 添加重试机制
      let retries = 3;
      let tx;
      
      while (retries > 0) {
        try {
          tx = await contract.claimRewards();
          console.log('领取收益交易已发送:', tx.hash);
          break;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!tx) {
        throw new Error('领取收益交易发送失败');
      }

      await tx.wait();
      return true;
    } catch (error: any) {
      console.error('领取收益失败:', error);
      return false;
    }
  }, [getContract]);

  return {
    stake,
    withdraw,
    claimRewards,
    loading,
    error,
    clearError
  };
};