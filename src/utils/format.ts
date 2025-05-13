import { ethers } from 'ethers';

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (amount: string | number): string => {
  try {
    if (!amount) return '0.00000';
    
    let formattedAmount: string;
    
    // 如果输入是BigNumber或者hex字符串，使用formatEther
    if (ethers.BigNumber.isBigNumber(amount) || 
        (typeof amount === 'string' && amount.startsWith('0x'))) {
      formattedAmount = ethers.utils.formatEther(amount);
    } else {
      // 如果是普通数字或字符串，直接转换
      formattedAmount = amount.toString();
    }
    
    // 统一格式化为5位小数
    return Number(formattedAmount).toFixed(5);
  } catch (error) {
    console.error('格式化代币金额失败:', error, '输入值:', amount);
    return '0.00000';
  }
}; 