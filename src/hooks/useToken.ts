import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { TOKEN_ADDRESS } from '../config/contracts';
import { useContract } from './useContract';
import { formatTokenAmount } from '../utils/format';

const TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export const useToken = () => {
  const { provider, account } = useWeb3();
  const { getContract } = useContract(TOKEN_ABI);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async (address: string): Promise<string> => {
    if (!address) {
      console.error('地址不能为空');
      return '0';
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('获取合约实例失败');
      }

      // 添加重试机制
      let retries = 3;
      let balance;
      
      while (retries > 0) {
        try {
          balance = await contract.balanceOf(address);
          break;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
        }
      }

      if (!balance) {
        throw new Error('获取余额失败');
      }

      return formatTokenAmount(balance.toString());
    } catch (err: any) {
      console.error('获取余额时发生错误:', err);
      setError(err.message || '获取余额失败');
      return '0';
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  const approve = useCallback(async (spender: string, amount: string): Promise<boolean> => {
    if (!spender || !amount) {
      console.error('授权参数无效');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error('获取合约实例失败');
      }

      // 检查当前授权额度
      const currentAllowance = await contract.allowance(await contract.signer.getAddress(), spender);
      if (currentAllowance.gte(ethers.utils.parseEther(amount))) {
        return true; // 已有足够的授权额度
      }

      // 添加重试机制
      let retries = 3;
      let tx;
      
      while (retries > 0) {
        try {
          tx = await contract.approve(spender, ethers.utils.parseEther(amount));
          break;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!tx) {
        throw new Error('授权交易发送失败');
      }

      await tx.wait();
      return true;
    } catch (err: any) {
      console.error('授权时发生错误:', err);
      setError(err.message || '授权失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  const getAllowance = async (owner: string, spender: string): Promise<string> => {
    if (!provider || !owner || !spender) {
      console.error('Provider、owner 或 spender 为空');
      return '0';
    }

    if (!TOKEN_ADDRESS) {
      console.error('代币地址未配置');
      return '0';
    }

    try {
      console.log('正在获取授权额度...', {
        tokenAddress: TOKEN_ADDRESS,
        owner,
        spender,
        network: await provider.getNetwork()
      });

      // 检查代币合约是否存在
      const code = await provider.getCode(TOKEN_ADDRESS);
      console.log('合约代码:', code);
      
      if (code === '0x') {
        console.error('代币合约不存在');
        return '0';
      }

      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
      console.log('合约实例已创建:', {
        address: tokenContract.address,
        interface: tokenContract.interface.format()
      });
      
      try {
        console.log('正在调用 allowance...');
        // 使用 callStatic 来模拟调用
        const allowance = await tokenContract.callStatic.allowance(owner, spender);
        console.log('原始授权额度:', allowance.toString());
        const formattedAllowance = ethers.utils.formatEther(allowance);
        console.log('格式化后的授权额度:', formattedAllowance);
        return formattedAllowance;
      } catch (err: any) {
        console.error('allowance 调用失败:', err);
        if (err.code === 'CALL_EXCEPTION') {
          console.error('合约可能未实现 allowance 方法或参数无效');
          console.error('错误详情:', {
            code: err.code,
            message: err.message,
            data: err.data,
            transaction: err.transaction
          });
        }
        return '0';
      }
    } catch (error) {
      console.error('获取授权额度失败:', error);
      return '0';
    }
  };

  return {
    getBalance,
    approve,
    getAllowance,
    loading,
    error
  };
}; 