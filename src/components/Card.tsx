import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardTitle = styled.h3`
  color: #fff;
  margin: 0 0 15px;
  font-size: 18px;
`;

const CardValue = styled.div`
  color: #3498db;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <CardContainer>{children}</CardContainer>;
};

export { CardTitle, CardValue, CardLabel }; 