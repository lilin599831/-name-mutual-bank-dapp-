import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageButton = styled.button<{ isActive: boolean }>`
  background: ${(props: { isActive: boolean }) => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${(props: { isActive: boolean }) => props.isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin: 0 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 0 10px;
`;

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Container>
      <LanguageButton
        isActive={language === 'zh'}
        onClick={() => setLanguage('zh')}
      >
        中文
      </LanguageButton>
      <LanguageButton
        isActive={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </LanguageButton>
      <LanguageButton
        isActive={language === 'ja'}
        onClick={() => setLanguage('ja')}
      >
        日本語
      </LanguageButton>
      <LanguageButton
        isActive={language === 'ko'}
        onClick={() => setLanguage('ko')}
      >
        한국어
      </LanguageButton>
    </Container>
  );
}; 