import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { ConnectWalletCard } from '../components/ConnectWalletCard';
import { useLanguage } from '../contexts/LanguageContext';

const GlobalStyle = createGlobalStyle<{ isLocked: boolean }>`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: ${props => props.isLocked ? 'hidden' : 'auto'};
    position: ${props => props.isLocked ? 'fixed' : 'static'};
    left: 0;
    top: 0;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

const PageWrapper = styled.div<{ isLocked: boolean }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: ${props => props.isLocked ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  background: transparent;
  z-index: 1000;
  overflow: ${props => props.isLocked ? 'hidden' : 'auto'};
`;

const CardWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 1001;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h1`
  color: #fff;
  margin: 0 0 20px;
  font-size: 32px;
  text-align: center;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const translations = {
  zh: {
    home: '首页',
    welcome: '欢迎来到 Mutual Bank',
    description: '去中心化质押平台',
    connectPrompt: '连接钱包后即可开始您的质押之旅，享受稳定收益。'
  },
  en: {
    home: 'Home',
    welcome: 'Welcome to Mutual Bank',
    description: 'Decentralized Staking Platform',
    connectPrompt: 'Connect your wallet to start your staking journey and earn stable rewards.'
  },
  ja: {
    home: 'ホーム',
    welcome: 'Mutual Bank へようこそ',
    description: '分散型ステーキングプラットフォーム',
    connectPrompt: 'ウォレットを接続して、ステーキングを始めましょう。'
  },
  ko: {
    home: '홈',
    welcome: 'Mutual Bank에 오신 것을 환영합니다',
    description: '탈중앙화 스테이킹 플랫폼',
    connectPrompt: '지갑을 연결하여 스테이킹을 시작하고 안정적인 수익을 얻으세요.'
  }
};

export const Home: React.FC = () => {
  const { account } = useWeb3();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const isLocked = !account;

  return (
    <>
      <GlobalStyle isLocked={isLocked} />
      <PageWrapper isLocked={isLocked}>
        <CardWrapper>
          {!account ? (
            <ConnectWalletCard />
          ) : (
            <Card>
              <Title>{t.welcome}</Title>
              <Description>{t.description}</Description>
            </Card>
          )}
        </CardWrapper>
      </PageWrapper>
    </>
  );
};

export default Home; 