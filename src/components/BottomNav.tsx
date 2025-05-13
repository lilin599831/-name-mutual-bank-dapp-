import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaChartLine, FaUsers, FaUser } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => props.$active ? 'transparent' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 12px;
  padding: 4px 0;
  min-width: 56px;
  position: relative;
  transition: all 0.3s ease;

  svg {
    font-size: 20px;
    margin-bottom: 4px;
    color: ${props => props.$active ? '#3498db' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.$active ? 'linear-gradient(45deg, #3498db, #2ecc71)' : 'none'};
    -webkit-background-clip: ${props => props.$active ? 'text' : 'none'};
    background-clip: ${props => props.$active ? 'text' : 'none'};
    transition: all 0.3s ease;
  }

  span {
    background: ${props => props.$active ? 'linear-gradient(45deg, #3498db, #2ecc71)' : 'none'};
    -webkit-background-clip: ${props => props.$active ? 'text' : 'none'};
    background-clip: ${props => props.$active ? 'text' : 'none'};
    color: ${props => props.$active ? 'transparent' : 'inherit'};
    transition: all 0.3s ease;
  }

  &:hover {
    color: transparent;

    svg, span {
      background: linear-gradient(45deg, #3498db, #2ecc71);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
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

  return (
    <NavContainer>
      <NavContent>
        <NavItem to="/" $active={location.pathname === '/'}>
          <FaHome />
          <span>{t.home}</span>
        </NavItem>
        <NavItem to="/stake" $active={location.pathname === '/stake'}>
          <FaChartLine />
          <span>{t.stake}</span>
        </NavItem>
        <NavItem to="/referral" $active={location.pathname === '/referral'}>
          <FaUsers />
          <span>{t.referral}</span>
        </NavItem>
        <NavItem to="/profile" $active={location.pathname === '/profile'}>
          <FaUser />
          <span>{t.profile}</span>
        </NavItem>
      </NavContent>
    </NavContainer>
  );
}; 