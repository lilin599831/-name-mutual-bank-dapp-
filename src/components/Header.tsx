import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './Button';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 60px;
    gap: 8px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const LanguageSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 8px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover, &:focus {
    border-color: transparent;
    background: linear-gradient(45deg, rgba(52, 152, 219, 0.2), rgba(46, 204, 113, 0.2));
    box-shadow: 0 0 0 1px rgba(52, 152, 219, 0.5);
  }

  option {
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.7);
    padding: 8px;

    &:hover, &:focus {
      background: linear-gradient(45deg, #3498db, #2ecc71);
      color: white;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 6px;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Address = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 8px;
    max-width: 80px;
  }
`;

const translations = {
  zh: {
    home: '首页',
    stake: '质押',
    referral: '推荐',
    profile: '我的',
    connect: '连接钱包',
    disconnect: '断开连接'
  },
  en: {
    home: 'Home',
    stake: 'Stake',
    referral: 'Referral',
    profile: 'Profile',
    connect: 'Connect Wallet',
    disconnect: 'Disconnect'
  },
  ja: {
    home: 'ホーム',
    stake: 'ステーキング',
    referral: '紹介',
    profile: 'マイページ',
    connect: 'ウォレット接続',
    disconnect: '切断'
  },
  ko: {
    home: '홈',
    stake: '스테이킹',
    referral: '추천',
    profile: '내 정보',
    connect: '지갑 연결',
    disconnect: '연결 해제'
  }
};

const languageNames = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어'
};

export const Header: React.FC = () => {
  const { isConnected, account, connect, disconnect } = useWeb3();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const location = useLocation();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo>MutualBank</Logo>
        </LogoContainer>
        <RightSection>
          <LanguageSelect value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </LanguageSelect>
          {isConnected ? (
            <WalletInfo>
              <Address>{formatAddress(account || '')}</Address>
              <Button
                variant="secondary"
                size="small"
                onClick={disconnect}
              >
                {t.disconnect}
              </Button>
            </WalletInfo>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={connect}
            >
              {t.connect}
            </Button>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}; 