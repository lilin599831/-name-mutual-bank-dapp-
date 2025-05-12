import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { useWeb3 } from '../contexts/Web3Context';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`;

const Description = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
  max-width: 400px;
  line-height: 1.5;
`;

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
}

export const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "请连接钱包",
  description = "连接钱包后即可开始使用MutualBank的所有功能"
}) => {
  const { connect } = useWeb3();

  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Button
        variant="primary"
        onClick={connect}
      >
        连接钱包
      </Button>
    </Container>
  );
}; 