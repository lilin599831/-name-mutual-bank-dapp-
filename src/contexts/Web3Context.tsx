import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
  switchNetwork: async () => {}
});

export const useWeb3 = () => useContext(Web3Context);

const SEPOLIA_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID) || 11155111;
const SEPOLIA_RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL || '';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      removeAllListeners: (eventName?: string) => void;
    };
  }
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(await provider.getNetwork().then(network => network.chainId));

        // 监听账户变化
        provider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnect();
          } else {
            setAccount(accounts[0]);
          }
        });

        // 监听链变化
        provider.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        console.error('连接钱包失败:', error);
      }
    } else {
      console.error('请安装 MetaMask');
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      throw new Error('请安装 MetaMask');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // 如果链不存在，则添加链
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SepETH',
                  decimals: 18,
                },
                rpcUrls: [SEPOLIA_RPC_URL],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('添加 Sepolia 网络失败:', addError);
          throw addError;
        }
      } else {
        console.error('切换网络失败:', switchError);
        throw switchError;
      }
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        provider.removeAllListeners();
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        isConnected,
        connect,
        disconnect,
        chainId,
        switchNetwork
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}; 