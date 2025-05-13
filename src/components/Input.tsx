import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StyledInput = styled.input<{ error?: string; fullWidth?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.error ? '#e74c3c' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 16px; // 保持16px以避免iOS自动缩放
    padding: 10px 14px;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput
        error={error}
        fullWidth={fullWidth}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
}; 