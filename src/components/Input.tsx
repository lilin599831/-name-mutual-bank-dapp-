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

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.hasError ? 'rgba(231, 76, 60, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
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
        hasError={!!error}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
}; 