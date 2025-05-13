import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useLanguage } from '../contexts/LanguageContext';

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 768px) {
    width: calc(100% - 40px);
    padding: 20px;
    margin: 0 20px;
  }
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ConnectButton = styled.button`
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const translations = {
  zh: {
    title: '开启您的去中心化金融之旅',
    description: '连接钱包后即可开始使用MutualBank的所有功能，体验Web3的收益模式。',
    connectButton: '连接钱包'
  },
  en: {
    title: 'Start Your DeFi Journey',
    description: 'Connect your wallet to access all features of MutualBank and experience Web3 earnings.',
    connectButton: 'Connect Wallet'
  },
  ja: {
    title: '分散型金融の旅を始めましょう',
    description: 'ウォレットを接続してMutualBankのすべての機能を利用し、Web3の収益モデルを体験しましょう。',
    connectButton: 'ウォレットを接続'
  },
  ko: {
    title: '탈중앙화 금융 여정을 시작하세요',
    description: '지갑을 연결하여 MutualBank의 모든 기능을 사용하고 Web3 수익 모델을 경험하세요.',
    connectButton: '지갑 연결'
  }
};

export const ConnectWalletCard: React.FC = () => {
  const { connect } = useWeb3();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <CardContainer>
      <Title>{t.title}</Title>
      <Description>{t.description}</Description>
      <ConnectButton onClick={connect}>
        {t.connectButton}
      </ConnectButton>
    </CardContainer>
  );
}; 