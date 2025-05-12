import React from 'react';
import styled from 'styled-components';

interface TransactionModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  loading: boolean;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #2d2d2d;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 20px;
  color: #fff;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &::after {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #3498db;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  title,
  onClose,
  loading
}) => {
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{title}</Title>
        {loading && <LoadingSpinner />}
      </ModalContent>
    </ModalOverlay>
  );
}; 