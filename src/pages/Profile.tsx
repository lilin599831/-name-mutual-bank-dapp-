import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useUserInfo } from '../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import { formatTokenAmount } from '../utils/format';
import { ConnectWalletCard } from '../components/ConnectWalletCard';
import { useToken } from '../hooks/useToken';

const GlobalStyle = createGlobalStyle<{ isLocked: boolean }>`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
`;

const AnimatedContainer = styled.div<{ animation: string }>`
  width: 100%;
  max-width: 800px;
  animation: ${props => props.animation} 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Card = styled.div`
  background: rgba(52, 152, 219, 0.1);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  color: transparent;
  margin: 0;
  font-size: 24px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WalletAddress = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 4px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: rgba(52, 152, 219, 0.1);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(52, 152, 219, 0.3);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }
`;

const StyledButton = styled.button`
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:nth-child(2) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const PageWrapper = styled.div<{ isLocked: boolean }>`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
`;

const CardWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1001;
`;

const translations = {
  zh: {
    title: '个人中心',
    user: '用户',
    totalStaked: '总质押量',
    stakingRate: '质押利率',
    referrer: '推荐人',
    noReferrer: '无',
    stakeNow: '开始质押',
    refer: '推荐好友',
    unit: 'MBT',
    connectPrompt: '连接钱包后即可查看您的个人信息',
    walletAddress: '钱包地址',
    balance: '钱包余额'
  },
  en: {
    title: 'Profile',
    user: 'User',
    totalStaked: 'Total Staked',
    stakingRate: 'Staking Rate',
    referrer: 'Referrer',
    noReferrer: 'None',
    stakeNow: 'Stake Now',
    refer: 'Refer Friends',
    unit: 'MBT',
    connectPrompt: 'Connect wallet to view your profile',
    walletAddress: 'Wallet Address',
    balance: 'Balance'
  },
  ja: {
    title: 'プロフィール',
    user: 'ユーザー',
    totalStaked: '総ステーク量',
    stakingRate: 'ステーク利率',
    referrer: '紹介者',
    noReferrer: 'なし',
    stakeNow: 'ステークを開始',
    refer: '友達を紹介',
    unit: 'MBT',
    connectPrompt: 'ウォレットを接続してプロフィールを表示',
    walletAddress: 'ウォレットアドレス',
    balance: '残高'
  },
  ko: {
    title: '프로필',
    user: '사용자',
    totalStaked: '총 스테이킹',
    stakingRate: '스테이킹 이율',
    referrer: '추천인',
    noReferrer: '없음',
    stakeNow: '스테이킹 시작',
    refer: '친구 추천',
    unit: 'MBT',
    connectPrompt: '지갑을 연결하여 프로필 보기',
    walletAddress: '지갑 주소',
    balance: '잔액'
  }
};

export const Profile: React.FC = () => {
  const { account } = useWeb3();
  const { userInfo } = useUserInfo();
  const { getBalance } = useToken();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getBalance(account);
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [account, getBalance]);

  if (!account) {
    return (
      <>
        <GlobalStyle isLocked={true} />
        <PageWrapper isLocked={true}>
          <CardWrapper>
            <ConnectWalletCard />
          </CardWrapper>
        </PageWrapper>
      </>
    );
  }

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <>
      <GlobalStyle isLocked={false} />
      <PageWrapper isLocked={false}>
        <Container>
          <AnimatedContainer animation="fadeIn">
            <Card>
              <ProfileHeader>
                <UserInfo>
                  <Username>{t.user}</Username>
                  <WalletAddress>{t.walletAddress}: {shortAddress}</WalletAddress>
                </UserInfo>
              </ProfileHeader>
              <StatsGrid>
                <StatCard>
                  <StatValue>{formatTokenAmount(String(userInfo?.totalStaked ?? '0'))} {t.unit}</StatValue>
                  <StatLabel>{t.totalStaked}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{userInfo?.stakingRate ?? '0.000'}%</StatValue>
                  <StatLabel>{t.stakingRate}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{formatTokenAmount(balance)} {t.unit}</StatValue>
                  <StatLabel>{t.balance}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>
                    {userInfo?.referrer === ethers.constants.AddressZero ? t.noReferrer : `${userInfo?.referrer.slice(0, 6)}...${userInfo?.referrer.slice(-4)}`}
                  </StatValue>
                  <StatLabel>{t.referrer}</StatLabel>
                </StatCard>
              </StatsGrid>
              <ActionButtons>
                <StyledButton onClick={() => navigate('/stake')}>
                  {t.stakeNow}
                </StyledButton>
                <StyledButton onClick={() => navigate('/referral')}>
                  {t.refer}
                </StyledButton>
              </ActionButtons>
            </Card>
          </AnimatedContainer>
        </Container>
      </PageWrapper>
    </>
  );
};

export default Profile; 