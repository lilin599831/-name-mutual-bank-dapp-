import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaChartBar, FaUsers, FaUser } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(18, 18, 18, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  padding: 0 10px;
  z-index: 1000;
  will-change: transform;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.active ? 'linear-gradient(135deg, #3498db, #2ecc71)' : 'none'};
  -webkit-background-clip: ${props => props.active ? 'text' : 'none'};
  background-clip: ${props => props.active ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.active ? 'transparent' : 'inherit'};
  text-decoration: none;
  font-size: 12px;
  padding: 8px;
  transition: all 0.3s ease;
  will-change: transform;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  min-width: 60px;

  @media (min-width: 769px) {
    font-size: 14px;
    min-width: 80px;
    
    svg {
      font-size: 24px;
    }
  }

  svg {
    font-size: 20px;
    margin-bottom: 4px;
    color: ${props => props.active ? '#3498db' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.active ? 'linear-gradient(135deg, #3498db, #2ecc71)' : 'none'};
    -webkit-background-clip: ${props => props.active ? 'text' : 'none'};
    background-clip: ${props => props.active ? 'text' : 'none'};
    -webkit-text-fill-color: ${props => props.active ? 'transparent' : 'inherit'};
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  &:hover {
    opacity: 0.8;
    
    svg {
      opacity: 0.8;
    }
  }
`;

const translations = {
  zh: {
    home: '首页',
    stake: '质押',
    referral: '推荐',
    profile: '我的'
  },
  en: {
    home: 'Home',
    stake: 'Stake',
    referral: 'Refer',
    profile: 'Profile'
  },
  ja: {
    home: 'ホーム',
    stake: 'ステーク',
    referral: '紹介',
    profile: 'マイ'
  },
  ko: {
    home: '홈',
    stake: '스테이킹',
    referral: '추천',
    profile: '내 정보'
  }
};

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavContainer>
      <NavItem to="/" active={isActive('/')}>
        <FaHome />
        {t.home}
      </NavItem>
      <NavItem to="/stake" active={isActive('/stake')}>
        <FaChartBar />
        {t.stake}
      </NavItem>
      <NavItem to="/referral" active={isActive('/referral')}>
        <FaUsers />
        {t.referral}
      </NavItem>
      <NavItem to="/profile" active={isActive('/profile')}>
        <FaUser />
        {t.profile}
      </NavItem>
    </NavContainer>
  );
}; 