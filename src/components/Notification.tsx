import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const getBackgroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#2ecc71';
    case 'error':
      return '#e74c3c';
    case 'info':
      return '#3498db';
    default:
      return '#3498db';
  }
};

const NotificationContainer = styled.div<{ type: string; isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background: ${props => getBackgroundColor(props.type)};
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-in-out forwards;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  max-width: 400px;

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  font-size: 20px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose
}) => {
  return (
    <NotificationContainer type={type} isVisible={isVisible}>
      <span>{message}</span>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </NotificationContainer>
  );
}; 