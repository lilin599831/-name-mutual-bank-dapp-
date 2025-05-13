import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useUserInfo } from '../hooks/useUserInfo';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { ConnectWalletCard } from '../components/ConnectWalletCard';
import { useLanguage } from '../contexts/LanguageContext';

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

const translations = {
  zh: {
    title: '开启您的去中心化金融之旅',
    subtitle: '加入MutualBank生态系统，体验Web3的收益模式。通过智能合约保障的透明机制，让您的资产安全增值。现在开始，与我们一起构建去中心化金融的未来。',
    startNow: '立即开始',
    connectPrompt: '连接钱包后即可开始使用MutualBank的所有功能，体验Web3的收益模式。',
    features: {
      staking: {
        title: '高收益质押',
        description: '提供极具竞争力的质押收益率，根据质押规模动态调整，让您的资产获得最优回报。灵活的质押期限，满足不同投资需求。'
      },
      referral: {
        title: '推荐奖励',
        description: '创新的推荐机制，邀请好友参与质押即可获得额外收益。让您的社交网络为你提供额外收益来源。'
      },
      security: {
        title: '安全可靠',
        description: '采用行业领先的安全标准，智能合约经过严格审计。多重安全保障机制，确保您的资产安全无忧。'
      }
    }
  },
  en: {
    title: 'Start Your DeFi Journey',
    subtitle: 'Join the MutualBank ecosystem and experience Web3 earnings. Through smart contract-guaranteed transparent mechanisms, your assets can grow safely. Start now and build the future of decentralized finance with us.',
    startNow: 'Start Now',
    connectPrompt: 'Connect your wallet to access all features of MutualBank and experience Web3 earnings.',
    features: {
      staking: {
        title: 'High-Yield Staking',
        description: 'Offering competitive staking rates that adjust dynamically based on stake size, ensuring optimal returns for your assets. Flexible staking periods to meet different investment needs.'
      },
      referral: {
        title: 'Referral Rewards',
        description: 'Innovative referral mechanism - earn extra rewards by inviting friends to stake. Let your social network become an additional source of income.'
      },
      security: {
        title: 'Safe & Reliable',
        description: 'Adopting industry-leading security standards with thoroughly audited smart contracts. Multiple security measures ensure your assets are protected.'
      }
    }
  },
  ja: {
    title: '分散型金融の旅を始めましょう',
    subtitle: 'MutualBankのエコシステムに参加し、Web3の収益を体験しましょう。スマートコントラクトが保証する透明性の高い仕組みで、資産を安全に成長させることができます。今すぐ始めて、分散型金融の未来を一緒に構築しましょう。',
    startNow: '今すぐ始める',
    connectPrompt: 'ウォレットを接続してMutualBankのすべての機能にアクセスし、Web3の収益を体験しましょう。',
    features: {
      staking: {
        title: '高収益ステーキング',
        description: 'ステーク規模に応じて動的に調整される競争力のある収益率を提供し、資産の最適なリターンを確保します。柔軟なステーキング期間で様々な投資ニーズに対応。'
      },
      referral: {
        title: '紹介報酬',
        description: '革新的な紹介システム - 友達をステーキングに招待するだけで追加の報酬を獲得できます。あなたのソーシャルネットワークを収入源に。'
      },
      security: {
        title: '安全性と信頼性',
        description: '業界最高水準のセキュリティ基準を採用し、スマートコントラクトは厳格な監査を受けています。複数のセキュリティ対策で資産を保護します。'
      }
    }
  },
  ko: {
    title: 'DeFi 여정을 시작하세요',
    subtitle: 'MutualBank 생태계에 참여하여 Web3 수익 모델을 경험하세요. 스마트 컨트랙트가 보장하는 투명한 메커니즘을 통해 자산을 안전하게 성장시킬 수 있습니다. 지금 시작하여 탈중앙화 금융의 미래를 함께 만들어가세요.',
    startNow: '지금 시작하기',
    connectPrompt: '지갑을 연결하여 MutualBank의 모든 기능을 이용하고 Web3 수익을 경험하세요.',
    features: {
      staking: {
        title: '고수익 스테이킹',
        description: '스테이킹 규모에 따라 동적으로 조정되는 경쟁력 있는 수익률을 제공하여 자산의 최적 수익을 보장합니다. 다양한 투자 요구를 충족하는 유연한 스테이킹 기간.'
      },
      referral: {
        title: '추천 보상',
        description: '혁신적인 추천 시스템 - 친구를 스테이킹에 초대하여 추가 보상을 받으세요. 소셜 네트워크를 통한 새로운 수입원을 만드세요.'
      },
      security: {
        title: '안전성과 신뢰성',
        description: '업계 최고 수준의 보안 표준을 채택하고 스마트 컨트랙트는 엄격한 감사를 거쳤습니다. 다중 보안 장치로 자산을 안전하게 보호합니다.'
      }
    }
  }
};

export const Dashboard: React.FC = () => {
  const { isConnected } = useWeb3();
  const { userInfo, tokenBalance, loading: userInfoLoading, error: userInfoError } = useUserInfo();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  if (!isConnected) {
    return (
      <DashboardContainer>
        <ConnectWalletCard />
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
        <Title>{t.title}</Title>
        <Subtitle>{t.subtitle}</Subtitle>
        <CTAButton
          variant="primary"
          onClick={() => navigate('/stake')}
        >
          {t.startNow}
        </CTAButton>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>💰</FeatureIcon>
          <FeatureTitle>{t.features.staking.title}</FeatureTitle>
          <FeatureDescription>{t.features.staking.description}</FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>{t.features.referral.title}</FeatureTitle>
          <FeatureDescription>{t.features.referral.description}</FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>{t.features.security.title}</FeatureTitle>
          <FeatureDescription>{t.features.security.description}</FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 