import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './Button';
import { formatAddress } from '../utils/format';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  --gradient-start: #3498db;
  --gradient-end: #2ecc71;
  
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: var(--gradient-start);
  display: inline-block;
  position: relative;
  padding: 5px 0;
  transition: all 0.3s ease;

  &::before {
    content: 'MutualBank';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;

  &:hover {
    color: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$active ? 'linear-gradient(45deg, #3498db, #2ecc71)' : 'transparent'};
    transition: all 0.3s ease;
    transform: scaleX(${props => props.$active ? 1 : 0});
  }

  &:hover::after {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    transform: scaleX(1);
  }
`;

const ConnectButton = styled(Button)`
  border-radius: 20px;
  padding: 8px 20px;
`;

const Address = styled.div`
  color: #fff;
  font-size: 14px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
`;

export const Navbar: React.FC = () => {
  const { isConnected, account, connect } = useWeb3();
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">MutualBank</Logo>
        <NavLinks>
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
          {isConnected ? (
            <Address>{formatAddress(account || '')}</Address>
          ) : (
            <ConnectButton variant="primary" onClick={connect}>
              连接钱包
            </ConnectButton>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}; 