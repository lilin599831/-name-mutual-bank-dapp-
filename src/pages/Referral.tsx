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
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 auto 16px;
    max-width: calc(100vw - 32px);
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
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const LinkTitle = styled.h3`
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
`;

const LinkBox = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 12px;
    flex-direction: column;
    gap: 12px;
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
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border: none;
  color: white;
  
  &:hover {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    opacity: 0.9;
  }
  
  &:disabled {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    opacity: 0.5;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
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

const translations = {
  zh: {
    title: '推荐中心',
    referral: '推荐中心',
    totalReferred: '总推荐质押量',
    referralRate: '推荐奖励率',
    copyLink: '复制推荐链接',
    copied: '已复制',
    referralList: '推荐列表',
    address: '地址',
    amount: '质押量',
    time: '时间',
    noReferrals: '暂无推荐记录',
    description: '邀请好友参与质押，您将获得额外的推荐奖励。每成功邀请一位好友质押，您将获得其质押收益一定比例的奖励。推荐奖励比例将随着您的推荐总质押量增加而提高。',
    yourReferralLink: '您的推荐链接',
    copySuccess: '推荐链接已复制到剪贴板',
    connectPrompt: '连接钱包后即可查看您的推荐信息，邀请好友共同赚取收益。',
    referralData: '推荐数据',
    totalStakeAmount: '推荐总质押量',
    rewardRate: '推荐奖励比例',
    referralCount: '推荐用户数量',
    referralUserList: '推荐用户列表',
    userAddress: '用户地址',
    stakeAmount: '质押数量',
    stakeTime: '质押时间',
    noReferralUsers: '暂无推荐用户',
    unit: 'MBT'
  },
  en: {
    title: 'Referral Center',
    referral: 'Referral Center',
    totalReferred: 'Total Referred Stake',
    referralRate: 'Referral Rate',
    copyLink: 'Copy Referral Link',
    copied: 'Copied',
    referralList: 'Referral List',
    address: 'Address',
    amount: 'Stake Amount',
    time: 'Time',
    noReferrals: 'No referrals yet',
    description: 'Invite friends to stake and earn extra referral rewards. For each successful referral, you will receive a percentage of their staking rewards. The referral reward rate increases as your total referred stake grows.',
    yourReferralLink: 'Your Referral Link',
    copySuccess: 'Referral link copied to clipboard',
    connectPrompt: 'Connect your wallet to view your referral information and invite friends to earn together.',
    referralData: 'Referral Data',
    totalStakeAmount: 'Total Referred Stake',
    rewardRate: 'Referral Reward Rate',
    referralCount: 'Referral Count',
    referralUserList: 'Referral User List',
    userAddress: 'User Address',
    stakeAmount: 'Stake Amount',
    stakeTime: 'Stake Time',
    noReferralUsers: 'No referral users yet',
    unit: 'MBT'
  },
  ja: {
    title: '紹介センター',
    referral: '紹介センター',
    totalReferred: '総紹介ステーク量',
    referralRate: '紹介報酬率',
    copyLink: '紹介リンクをコピー',
    copied: 'コピー済み',
    referralList: '紹介リスト',
    address: 'アドレス',
    amount: 'ステーク量',
    time: '時間',
    noReferrals: '紹介記録なし',
    description: '友達を招待してステークすると、追加の紹介報酬を獲得できます。紹介が成功するごとに、そのステーキング報酬の一定割合を受け取ることができます。紹介総ステーク量が増えるにつれて、紹介報酬率も上がります。',
    yourReferralLink: 'あなたの紹介リンク',
    copySuccess: '紹介リンクをクリップボードにコピーしました',
    connectPrompt: 'ウォレットを接続して、紹介情報を確認し、友達を招待して一緒に報酬を獲得しましょう。',
    referralData: '紹介データ',
    totalStakeAmount: '総紹介ステーク量',
    rewardRate: '紹介報酬率',
    referralCount: '紹介ユーザー数',
    referralUserList: '紹介ユーザーリスト',
    userAddress: 'ユーザーアドレス',
    stakeAmount: 'ステーク量',
    stakeTime: 'ステーク時間',
    noReferralUsers: '紹介ユーザーはまだいません',
    unit: 'MBT'
  },
  ko: {
    title: '추천 센터',
    referral: '추천 센터',
    totalReferred: '총 추천 스테이킹',
    referralRate: '추천 보상률',
    copyLink: '추천 링크 복사',
    copied: '복사됨',
    referralList: '추천 목록',
    address: '주소',
    amount: '스테이킹 량',
    time: '시간',
    noReferrals: '추천 기록 없음',
    description: '친구를 초대하여 스테이킹하면 추가 추천 보상을 받을 수 있습니다. 추천이 성공할 때마다 해당 스테이킹 보상의 일정 비율을 받게 됩니다. 총 추천 스테이킹 량이 증가함에 따라 추천 보상률도 증가합니다.',
    yourReferralLink: '내 추천 링크',
    copySuccess: '추천 링크가 클립보드에 복사되었습니다',
    connectPrompt: '지갑을 연결하여 추천 정보를 확인하고 친구를 초대하여 함께 수익을 얻으세요.',
    referralData: '추천 데이터',
    totalStakeAmount: '총 추천 스테이킹',
    rewardRate: '추천 보상률',
    referralCount: '추천 사용자 수',
    referralUserList: '추천 사용자 목록',
    userAddress: '사용자 주소',
    stakeAmount: '스테이킹 량',
    stakeTime: '스테이킹 시간',
    noReferralUsers: '추천 사용자가 없습니다',
    unit: 'MBT'
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
                <LinkTitle>{t.yourReferralLink}</LinkTitle>
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
                  <StatLabel>{t.totalStakeAmount}</StatLabel>
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
              <Title>{t.referralUserList}</Title>
              {referrals.length > 0 ? (
                <ReferralTable>
                  <thead>
                    <tr>
                      <TableHeader>{t.userAddress}</TableHeader>
                      <TableHeader>{t.stakeAmount}</TableHeader>
                      <TableHeader>{t.stakeTime}</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral, index) => (
                      <tr key={index}>
                        <td data-label={t.userAddress}>{formatAddress(referral.address)}</td>
                        <td data-label={t.stakeAmount}>{formatTokenAmount(referral.amount)} {t.unit}</td>
                        <td data-label={t.stakeTime}>{new Date(referral.startTime * 1000).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </ReferralTable>
              ) : (
                <EmptyMessage>{t.noReferralUsers}</EmptyMessage>
              )}
            </Card>
          </Container>
        )}
      </PageWrapper>
    </>
  );
};

export default ReferralPage; 