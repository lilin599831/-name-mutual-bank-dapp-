import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: linear-gradient(45deg, #3498db, #2ecc71);
        &:hover {
          opacity: 0.9;
        }
      `;
    case 'secondary':
      return css`
        background: rgba(255, 255, 255, 0.1);
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `;
    case 'danger':
      return css`
        background: rgba(255, 71, 87, 0.9);
        &:hover {
          background: rgba(255, 71, 87, 1);
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 8px 16px;
        font-size: 12px;
      `;
    case 'large':
      return css`
        padding: 16px 32px;
        font-size: 16px;
      `;
    default:
      return css`
        padding: 12px 24px;
        font-size: 14px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  position: relative;

  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'medium')}

  &:disabled {
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton disabled={disabled || loading} {...props}>
      {loading ? <LoadingSpinner /> : children}
    </StyledButton>
  );
}; 