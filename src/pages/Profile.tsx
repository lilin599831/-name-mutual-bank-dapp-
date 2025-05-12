import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useUserInfo } from '../hooks/useUserInfo';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { AnimatedContainer } from '../components/AnimatedContainer';
import { formatTokenAmount } from '../utils/format';
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt';

const ProfileContainer = styled.div`
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

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 32px;
  color: #fff;
  margin: 0 0 10px;
`;

const Address = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  
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
  width: 100%;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  word-break: break-all;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
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

export const Profile: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { userInfo, tokenBalance, loading: userInfoLoading, error: userInfoError } = useUserInfo();
  const navigate = useNavigate();

  if (!isConnected) {
    return (
      <ProfileContainer>
        <ConnectWalletPrompt 
          title="个人中心"
          description="连接钱包后即可查看您的个人资产和质押信息。"
        />
      </ProfileContainer>
    );
  }

  if (userInfoLoading) {
    return (
      <ProfileContainer>
        <Loading />
      </ProfileContainer>
    );
  }

  if (userInfoError) {
    return (
      <ProfileContainer>
        <ErrorMessage message={userInfoError} />
      </ProfileContainer>
    );
  }

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  return (
    <ProfileContainer>
      <AnimatedContainer animation="fadeIn">
        <Card>
          <ProfileHeader>
            <Avatar>
              {account ? account.slice(2, 4).toUpperCase() : '?'}
            </Avatar>
            <UserInfo>
              <Username>用户 {shortAddress}</Username>
              <Address>{account}</Address>
            </UserInfo>
          </ProfileHeader>
        </Card>

        <Card>
          <StatsGrid>
            <StatCard>
              <StatValue>{formatTokenAmount(userInfo?.totalStaked || '0')} MBT</StatValue>
              <StatLabel>总质押量</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{formatTokenAmount(tokenBalance)} MBT</StatValue>
              <StatLabel>代币余额</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{userInfo?.stakingRate || '0.000'}%</StatValue>
              <StatLabel>质押利率</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>
                {userInfo?.referrer === ethers.constants.AddressZero ? '无' : `${userInfo?.referrer.slice(0, 6)}...${userInfo?.referrer.slice(-4)}`}
              </StatValue>
              <StatLabel>推荐人</StatLabel>
            </StatCard>
          </StatsGrid>

          <ActionButtons>
            <StyledButton
              variant="primary"
              onClick={() => navigate('/stake')}
            >
              开始质押
            </StyledButton>
            <StyledButton
              variant="secondary"
              onClick={() => navigate('/referral')}
            >
              推荐好友
            </StyledButton>
          </ActionButtons>
        </Card>
      </AnimatedContainer>
    </ProfileContainer>
  );
};

export default Profile; 