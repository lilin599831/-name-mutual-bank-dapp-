import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

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

const NotificationContainer = styled.div<{ type: string; isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-in-out forwards;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  max-width: 400px;
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#2ecc71';
      case 'error':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  }};

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  font-size: 20px;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    transform: rotate(90deg);
  }
`;

const translations = {
  zh: {
    success: '操作成功',
    error: '操作失败',
    info: '提示信息',
    close: '关闭'
  },
  en: {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    close: 'Close'
  },
  ja: {
    success: '成功',
    error: 'エラー',
    info: 'お知らせ',
    close: '閉じる'
  },
  ko: {
    success: '성공',
    error: '오류',
    info: '알림',
    close: '닫기'
  }
};

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <NotificationContainer type={type} isVisible={isVisible}>
      <span>{message}</span>
      <CloseButton onClick={onClose} title={t.close}>&times;</CloseButton>
    </NotificationContainer>
  );
}; 