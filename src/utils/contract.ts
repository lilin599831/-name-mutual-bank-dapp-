import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../config/contracts';
import { MUTUAL_BANK_ABI_OLD, ERC20_ABI } from '../contracts/abi';

export const getContract = (provider: ethers.providers.Provider, address: string, abi: any) => {
  return new ethers.Contract(address, abi, provider);
};

export const getMutualBankContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, MUTUAL_BANK_ABI_OLD, providerOrSigner);
};

export const getTokenContract = (provider: ethers.providers.Provider) => {
  return getContract(provider, TOKEN_ADDRESS, ERC20_ABI);
}; 