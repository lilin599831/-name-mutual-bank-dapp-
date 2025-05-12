import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useUserInfo } from '../hooks/useUserInfo';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 80px;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
`;

const Title = styled.h1`
  font-size: 64px;
  color: #fff;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 50px;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 80px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(52, 152, 219, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 28px;
  color: white;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h3`
  color: #fff;
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.6;
`;

const CTAButton = styled(Button)`
  font-size: 20px;
  padding: 18px 48px;
  margin-top: 30px;
  border-radius: 30px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.1;
  background: 
    radial-gradient(circle at 20% 20%, #3498db 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, #2ecc71 0%, transparent 50%);
`;

export const Dashboard: React.FC = () => {
  const { isConnected } = useWeb3();
  const { userInfo, tokenBalance, loading: userInfoLoading, error: userInfoError } = useUserInfo();
  const navigate = useNavigate();

  if (!isConnected) {
    return (
      <DashboardContainer>
        <ConnectWalletPrompt 
          title="开启您的去中心化金融之旅"
          description="连接钱包后即可开始使用MutualBank的所有功能，体验Web3的收益模式。"
        />
      </DashboardContainer>
    );
  }

  if (userInfoLoading) {
    return (
      <DashboardContainer>
        <Loading />
      </DashboardContainer>
    );
  }

  if (userInfoError) {
    return (
      <DashboardContainer>
        <ErrorMessage message={userInfoError} />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <BackgroundDecoration />
      <HeroSection>
        <Title>开启您的去中心化金融之旅</Title>
        <Subtitle>
          加入MutualBank生态系统，体验Web3的收益模式。
          通过智能合约保障的透明机制，让您的资产安全增值。
          现在开始，与我们一起构建去中心化金融的未来。
        </Subtitle>
        <CTAButton
          variant="primary"
          onClick={() => navigate('/stake')}
        >
          立即开始
        </CTAButton>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>💰</FeatureIcon>
          <FeatureTitle>高收益质押</FeatureTitle>
          <FeatureDescription>
            提供极具竞争力的质押收益率，根据质押规模动态调整，
            让您的资产获得最优回报。灵活的质押期限，满足不同投资需求。
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>推荐奖励</FeatureTitle>
          <FeatureDescription>
            创新的推荐机制，邀请好友参与质押即可获得额外收益。
            让您的社交网络为你提供额外收益来源。
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>安全可靠</FeatureTitle>
          <FeatureDescription>
            采用行业领先的安全标准，智能合约经过严格审计。
            多重安全保障机制，确保您的资产安全无忧。
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 