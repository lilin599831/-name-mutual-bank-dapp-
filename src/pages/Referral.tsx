import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useReferrals } from '../hooks/useReferrals';
import { formatAddress } from '../utils/format';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { AnimatedContainer } from '../components/AnimatedContainer';
import { Button } from '../components/Button';
import { toast } from 'react-toastify';
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 20px;
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

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const ReferralLink = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
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
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
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

const ReferralList = styled.div`
  margin-top: 20px;
`;

const ReferralTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
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
`;

const Referral: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { referrals, totalReferred, referralRate, loading, error } = useReferrals(account);

  const handleCopyLink = () => {
    if (!account) return;
    const referralLink = `${window.location.origin}/stake?ref=${account}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('推荐链接已复制到剪贴板');
  };

  if (!isConnected) {
    return (
      <Container>
        <ConnectWalletPrompt 
          title="推荐中心"
          description="连接钱包后即可获取您的专属推荐链接，邀请好友参与质押。"
        />
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage message={error} />
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedContainer animation="fadeIn">
        <Card>
          <Title>推荐中心</Title>
          <Description>
            邀请好友参与质押，您将获得额外的推荐奖励。每成功邀请一位好友质押，
            您将获得其质押收益一定比例的奖励。推荐奖励比例将随着您的推荐总质押量增加而提高。
          </Description>

          <ReferralLink>
            <LinkTitle>您的推荐链接</LinkTitle>
            <LinkBox>
              <LinkText>
                {account ? `${window.location.origin}/stake?ref=${account}` : '请先连接钱包'}
              </LinkText>
              <CopyButton
                variant="secondary"
                size="small"
                onClick={handleCopyLink}
                disabled={!account}
              >
                复制链接
              </CopyButton>
            </LinkBox>
          </ReferralLink>
        </Card>

        <Card>
          <Title>推荐数据</Title>
          <StatsGrid>
            <StatCard>
              <StatValue>{totalReferred} MBT</StatValue>
              <StatLabel>推荐总质押量</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{referralRate}%</StatValue>
              <StatLabel>推荐奖励比例</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{referrals.length}</StatValue>
              <StatLabel>推荐用户数量</StatLabel>
            </StatCard>
          </StatsGrid>
        </Card>

        <Card>
          <Title>推荐用户列表</Title>
          {referrals.length > 0 ? (
            <ReferralTable>
              <thead>
                <tr>
                  <TableHeader>用户地址</TableHeader>
                  <TableHeader>质押数量</TableHeader>
                  <TableHeader>质押时间</TableHeader>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr key={index}>
                    <TableCell>{formatAddress(referral.address)}</TableCell>
                    <TableCell>{referral.amount} MBT</TableCell>
                    <TableCell>{new Date(referral.startTime * 1000).toLocaleString()}</TableCell>
                  </tr>
                ))}
              </tbody>
            </ReferralTable>
          ) : (
            <EmptyMessage>暂无推荐用户</EmptyMessage>
          )}
        </Card>
      </AnimatedContainer>
    </Container>
  );
};

export default Referral; 