import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 8px;
  padding: 15px;
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 12px;
  }
`;

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <ErrorContainer>
      {message}
    </ErrorContainer>
  );
}; 