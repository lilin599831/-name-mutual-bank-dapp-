import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { CONTRACT_ADDRESS } from '../config/contracts';

export const useContract = (abi: any) => {
  const { provider, account } = useWeb3();

  const getContract = () => {
    if (!provider || !CONTRACT_ADDRESS) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  };

  const getContractWithSigner = () => {
    if (!provider || !account || !CONTRACT_ADDRESS) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());
  };

  return {
    getContract,
    getContractWithSigner
  };
}; 