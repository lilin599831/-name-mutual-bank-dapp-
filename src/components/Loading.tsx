import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
`;

const translations = {
  zh: {
    loading: '加载中...'
  },
  en: {
    loading: 'Loading...'
  },
  ja: {
    loading: '読み込み中...'
  },
  ko: {
    loading: '로딩 중...'
  }
};

export const Loading: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{t.loading}</LoadingText>
    </LoadingContainer>
  );
}; 