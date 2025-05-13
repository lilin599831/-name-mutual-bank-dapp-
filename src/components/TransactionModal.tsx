import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 0 32px 0 rgba(31, 38, 135, 0.1);
  color: #fff;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
  transition: all 0.3s ease;
  border-radius: 50%;

  &:hover {
    color: #fff;
    transform: rotate(90deg);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: rgba(255, 255, 255, 0.9);
  gap: 12px;
  font-size: 16px;

  &::before {
    content: '';
    width: 24px;
    height: 24px;
    border: 3px solid rgba(52, 152, 219, 0.2);
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatusMessage = styled.div<{ status: 'success' | 'error' | 'waiting' }>`
  text-align: center;
  padding: 20px;
  margin: 10px 0;
  border-radius: 16px;
  background: ${props => 
    props.status === 'success' 
      ? 'rgba(46, 204, 113, 0.1)' 
      : props.status === 'error'
      ? 'rgba(231, 76, 60, 0.1)'
      : 'rgba(52, 152, 219, 0.1)'
  };
  color: ${props => 
    props.status === 'success' 
      ? '#2ecc71' 
      : props.status === 'error'
      ? '#e74c3c'
      : '#3498db'
  };
  backdrop-filter: blur(4px);
  border: 1px solid ${props => 
    props.status === 'success' 
      ? 'rgba(46, 204, 113, 0.2)' 
      : props.status === 'error'
      ? 'rgba(231, 76, 60, 0.2)'
      : 'rgba(52, 152, 219, 0.2)'
  };
`;

const translations = {
  zh: {
    processing: '交易处理中',
    confirm: '请在钱包中确认交易',
    success: '交易成功',
    failed: '交易失败',
    close: '关闭',
    waiting: '等待确认'
  },
  en: {
    processing: 'Processing Transaction',
    confirm: 'Please confirm the transaction in your wallet',
    success: 'Transaction Successful',
    failed: 'Transaction Failed',
    close: 'Close',
    waiting: 'Waiting for Confirmation'
  },
  ja: {
    processing: '取引処理中',
    confirm: 'ウォレットで取引を確認してください',
    success: '取引成功',
    failed: '取引失敗',
    close: '閉じる',
    waiting: '確認待ち'
  },
  ko: {
    processing: '거래 처리 중',
    confirm: '지갑에서 거래를 확인해주세요',
    success: '거래 성공',
    failed: '거래 실패',
    close: '닫기',
    waiting: '확인 대기 중'
  }
};

interface TransactionModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  loading: boolean;
  status?: 'success' | 'error' | 'waiting';
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  title,
  onClose,
  loading,
  status
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        {loading && (
          <LoadingSpinner>
            {t.processing}
          </LoadingSpinner>
        )}
        {status && !loading && (
          <StatusMessage status={status}>
            {status === 'success' ? t.success : status === 'error' ? t.failed : t.waiting}
          </StatusMessage>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}; 