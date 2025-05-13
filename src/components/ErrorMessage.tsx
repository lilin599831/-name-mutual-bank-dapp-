import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ErrorContainer = styled.div`
  background: rgba(231, 76, 60, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 16px;
  padding: 20px;
  color: #e74c3c;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 8px 32px 0 rgba(231, 76, 60, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &::before {
    content: '⚠️';
    font-size: 20px;
  }
`;

const translations = {
  zh: {
    error: '错误',
    defaultError: '发生未知错误，请稍后重试',
    networkError: '网络连接错误',
    contractError: '合约调用错误',
    walletError: '钱包连接错误',
    insufficientBalance: '余额不足',
    invalidAmount: '无效的金额',
    invalidAddress: '无效的地址',
    userRejected: '用户取消操作',
    tryAgain: '请重试'
  },
  en: {
    error: 'Error',
    defaultError: 'An unknown error occurred. Please try again later',
    networkError: 'Network connection error',
    contractError: 'Contract call error',
    walletError: 'Wallet connection error',
    insufficientBalance: 'Insufficient balance',
    invalidAmount: 'Invalid amount',
    invalidAddress: 'Invalid address',
    userRejected: 'User rejected operation',
    tryAgain: 'Please try again'
  },
  ja: {
    error: 'エラー',
    defaultError: '不明なエラーが発生しました。後でもう一度お試しください',
    networkError: 'ネットワーク接続エラー',
    contractError: 'コントラクトコールエラー',
    walletError: 'ウォレット接続エラー',
    insufficientBalance: '残高不足',
    invalidAmount: '無効な金額',
    invalidAddress: '無効なアドレス',
    userRejected: 'ユーザーが操作をキャンセルしました',
    tryAgain: 'もう一度お試しください'
  },
  ko: {
    error: '오류',
    defaultError: '알 수 없는 오류가 발생했습니다. 나중에 다시 시도해주세요',
    networkError: '네트워크 연결 오류',
    contractError: '컨트랙트 호출 오류',
    walletError: '지갑 연결 오류',
    insufficientBalance: '잔액 부족',
    invalidAmount: '유효하지 않은 금액',
    invalidAddress: '유효하지 않은 주소',
    userRejected: '사용자가 작업을 취소했습니다',
    tryAgain: '다시 시도해주세요'
  }
};

interface ErrorMessageProps {
  message?: string;
  type?: keyof typeof translations.zh;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  type = 'defaultError'
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const errorMessage = message || t[type];

  return (
    <ErrorContainer>
      {errorMessage}
    </ErrorContainer>
  );
}; 