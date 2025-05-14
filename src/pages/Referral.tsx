import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useReferrals } from '../hooks/useReferrals';
import { formatAddress, formatTokenAmount } from '../utils/format';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { ConnectWalletCard } from '../components/ConnectWalletCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import type { Referral as ReferralType } from '../hooks/useReferrals';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
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

const Title = styled.h2`
  color: #fff;
  margin: 0 0 20px;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const ReferralLink = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
`;

const LinkTitle = styled.h3`
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
`;

const LinkBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const LinkText = styled.div`
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
`;

const CopyButton = styled(Button)`
  min-width: 80px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #3498db, #2ecc71);
    opacity: 0.9;
  }
  
  &:disabled {
    background: linear-gradient(135deg, #3498db, #2ecc71);
    opacity: 0.5;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
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
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const ReferralTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: 16px;
    width: 100%;
    display: block;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
      width: 100%;
    }
    
    tr {
      display: block;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    td {
      display: block;
      padding: 4px 0;
      border: none;
      text-align: left;
      
      &:before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: 1rem;
      }
    }
  }
`;

const TableHeader = styled.th`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableCell = styled.td`
  padding: 16px;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px 16px;
    font-size: 14px;
  }
`;

const ReferralItem = styled.div`
  background: rgba(52, 152, 219, 0.1);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 8px;
  }
`;

const ReferralInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 15px;
`;

const ReferralDataItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`;

const ReferralLabel = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  min-width: 100px;

  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 90px;
  }
`;

const ReferralValue = styled.span<{ $primary?: boolean }>`
  font-size: ${props => props.$primary ? '15px' : '13px'};
  font-weight: ${props => props.$primary ? 'bold' : 'normal'};
  background: ${props => props.$primary ? 'linear-gradient(135deg, #3498db, #2ecc71)' : 'none'};
  -webkit-background-clip: ${props => props.$primary ? 'text' : 'none'};
  background-clip: ${props => props.$primary ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.$primary ? 'transparent' : 'rgba(255, 255, 255, 0.9)'};
  text-align: right;
  flex: 1;

  @media (max-width: 768px) {
    font-size: ${props => props.$primary ? '14px' : '12px'};
  }
`;

const AddressLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
  flex: 1;
  text-align: right;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #2ecc71, #27ae60)' : 
    'linear-gradient(135deg, #e74c3c, #c0392b)'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const translations = {
  zh: {
    title: '推荐',
    myReferralLink: '我的推荐链接',
    copyLink: '复制链接',
    copySuccess: '复制成功',
    referralList: '推荐用户列表',
    referralAddress: '推荐地址',
    totalStaked: '总质押量',
    joinTime: '加入时间',
    status: '状态',
    active: '活跃',
    inactive: '非活跃',
    noReferralUsers: '暂无推荐用户',
    unit: 'MBT',
    rewardRate: '推荐奖励率',
    referralCount: '推荐人数'
  },
  en: {
    title: 'Referral',
    myReferralLink: 'My Referral Link',
    copyLink: 'Copy Link',
    copySuccess: 'Copied Successfully',
    referralList: 'Referral Users',
    referralAddress: 'Referral Address',
    totalStaked: 'Total Staked',
    joinTime: 'Join Time',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    noReferralUsers: 'No referral users yet',
    unit: 'MBT',
    rewardRate: 'Referral Rate',
    referralCount: 'Referral Count'
  },
  ja: {
    title: '紹介',
    myReferralLink: '紹介リンク',
    copyLink: 'リンクをコピー',
    copySuccess: 'コピー成功',
    referralList: '紹介ユーザー一覧',
    referralAddress: '紹介アドレス',
    totalStaked: '総ステーク量',
    joinTime: '加入時間',
    status: 'ステータス',
    active: 'アクティブ',
    inactive: 'インアクティブ',
    noReferralUsers: '紹介ユーザーはまだいません',
    unit: 'MBT',
    rewardRate: '紹介報酬率',
    referralCount: '紹介者数'
  },
  ko: {
    title: '추천',
    myReferralLink: '내 추천 링크',
    copyLink: '링크 복사',
    copySuccess: '복사 성공',
    referralList: '추천 사용자 목록',
    referralAddress: '추천 주소',
    totalStaked: '총 스테이킹',
    joinTime: '가입 시간',
    status: '상태',
    active: '활성',
    inactive: '비활성',
    noReferralUsers: '추천 사용자가 없습니다',
    unit: 'MBT',
    rewardRate: '추천 보상률',
    referralCount: '추천자 수'
  }
};

const ReferralPage: React.FC = () => {
  const { account } = useWeb3();
  const { referrals, totalReferred, referralRate, loading, error } = useReferrals(account);
  const { language } = useLanguage();
  const { showNotification } = useNotification();
  const t = translations[language as keyof typeof translations];

  const handleCopyLink = () => {
    if (!account) return;
    const referralLink = `${window.location.origin}/stake?ref=${account}`;
    navigator.clipboard.writeText(referralLink);
    showNotification('success', t.copySuccess);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <GlobalStyle />
      <PageWrapper isLocked={!account}>
        {!account ? (
          <CardWrapper>
            <ConnectWalletCard />
          </CardWrapper>
        ) : loading ? (
          <Container>
            <Loading />
          </Container>
        ) : error ? (
          <Container>
            <ErrorMessage message={error} />
          </Container>
        ) : (
          <Container>
            <Card>
              <Title>{t.title}</Title>
              <ReferralLink>
                <LinkTitle>{t.myReferralLink}</LinkTitle>
                <LinkBox>
                  <LinkText>{`${window.location.origin}/stake?ref=${account}`}</LinkText>
                  <CopyButton onClick={handleCopyLink}>
                    {t.copyLink}
                  </CopyButton>
                </LinkBox>
              </ReferralLink>
              <StatsGrid>
                <StatCard>
                  <StatValue>{formatTokenAmount(totalReferred)} {t.unit}</StatValue>
                  <StatLabel>{t.totalStaked}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{referralRate}%</StatValue>
                  <StatLabel>{t.rewardRate}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{referrals.length}</StatValue>
                  <StatLabel>{t.referralCount}</StatLabel>
                </StatCard>
              </StatsGrid>
            </Card>
            
            <Card>
              <Title>{t.referralList}</Title>
              <List>
                {referrals.map((referral, index) => (
                  <ReferralItem key={index}>
                    <ReferralInfo>
                      <ReferralDataItem>
                        <ReferralLabel>{t.referralAddress}</ReferralLabel>
                        <AddressLink 
                          href={`${process.env.REACT_APP_EXPLORER_URL}/address/${referral.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortenAddress(referral.address)}
                        </AddressLink>
                      </ReferralDataItem>
                      <ReferralDataItem>
                        <ReferralLabel>{t.joinTime}</ReferralLabel>
                        <ReferralValue>{new Date(referral.startTime * 1000).toLocaleString()}</ReferralValue>
                      </ReferralDataItem>
                      <ReferralDataItem>
                        <ReferralLabel>{t.totalStaked}</ReferralLabel>
                        <ReferralValue $primary>{formatTokenAmount(referral.amount)} {t.unit}</ReferralValue>
                      </ReferralDataItem>
                    </ReferralInfo>
                  </ReferralItem>
                ))}
              </List>
            </Card>
          </Container>
        )}
      </PageWrapper>
    </>
  );
};

export default ReferralPage; 