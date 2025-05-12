import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { TOKEN_ADDRESS } from '../config/contracts';

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  }
];

export const useToken = () => {
  const { provider, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = async (address: string): Promise<string> => {
    if (!provider || !address) {
      console.error('Provider 或地址为空');
      return '0';
    }

    if (!TOKEN_ADDRESS) {
      console.error('代币地址未配置');
      return '0';
    }

    try {
      console.log('正在获取余额...', {
        tokenAddress: TOKEN_ADDRESS,
        address,
        provider: provider.constructor.name,
        network: await provider.getNetwork()
      });

      // 检查代币合约是否存在
      const code = await provider.getCode(TOKEN_ADDRESS);
      console.log('合约代码:', code);
      
      if (code === '0x') {
        console.error('代币合约不存在');
        return '0';
      }

      // 使用 provider 而不是 signer
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
      console.log('合约实例已创建:', {
        address: tokenContract.address,
        interface: tokenContract.interface.format()
      });
      
      // 检查合约是否实现了 balanceOf 方法
      try {
        console.log('正在调用 balanceOf...');
        // 使用 callStatic 来模拟调用
        const balance = await tokenContract.callStatic.balanceOf(address);
        console.log('原始余额:', balance.toString());
        const formattedBalance = ethers.utils.formatEther(balance);
        console.log('格式化后的余额:', formattedBalance);
        return formattedBalance;
      } catch (err: any) {
        console.error('balanceOf 调用失败:', err);
        if (err.code === 'CALL_EXCEPTION') {
          console.error('合约可能未实现 balanceOf 方法或地址无效');
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
      console.error('获取余额失败:', error);
      return '0';
    }
  };

  const approve = async (spender: string, amount: string): Promise<boolean> => {
    if (!provider || !account) {
      console.error('Provider 或账户为空');
      return false;
    }

    if (!TOKEN_ADDRESS) {
      console.error('代币地址未配置');
      return false;
    }

    try {
      console.log('正在发送授权交易...', {
        tokenAddress: TOKEN_ADDRESS,
        spender,
        amount,
        account,
        network: await provider.getNetwork()
      });

      // 检查代币合约是否存在
      const code = await provider.getCode(TOKEN_ADDRESS);
      console.log('合约代码:', code);
      
      if (code === '0x') {
        console.error('代币合约不存在');
        return false;
      }

      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider.getSigner());
      console.log('合约实例已创建:', {
        address: tokenContract.address,
        interface: tokenContract.interface.format()
      });
      
      const amountWei = ethers.utils.parseEther(amount);
      console.log('转换后的金额:', amountWei.toString());
      
      try {
        console.log('正在调用 approve...');
        const tx = await tokenContract.approve(spender, amountWei);
        console.log('交易已发送:', tx.hash);
        await tx.wait();
        console.log('交易已确认');
        return true;
      } catch (err: any) {
        console.error('approve 调用失败:', err);
        if (err.code === 'CALL_EXCEPTION') {
          console.error('合约可能未实现 approve 方法或参数无效');
          console.error('错误详情:', {
            code: err.code,
            message: err.message,
            data: err.data,
            transaction: err.transaction
          });
        }
        return false;
      }
    } catch (error) {
      console.error('授权交易失败:', error);
      return false;
    }
  };

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

      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
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