import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './Button';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 60px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#3498db' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: #3498db;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 10px;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Address = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

export const Header: React.FC = () => {
  const { isConnected, account, connect, disconnect } = useWeb3();
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
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            首页
          </NavLink>
          <NavLink to="/stake" $active={location.pathname === '/stake'}>
            质押
          </NavLink>
          <NavLink to="/referral" $active={location.pathname === '/referral'}>
            推荐
          </NavLink>
          <NavLink to="/profile" $active={location.pathname === '/profile'}>
            我的
          </NavLink>
        </Nav>
        {isConnected ? (
          <WalletInfo>
            <Address>{formatAddress(account || '')}</Address>
            <Button
              variant="secondary"
              size="small"
              onClick={disconnect}
            >
              断开
            </Button>
          </WalletInfo>
        ) : (
          <Button
            variant="primary"
            size="small"
            onClick={connect}
          >
            连接钱包
          </Button>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
}; 