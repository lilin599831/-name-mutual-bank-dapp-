import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

interface AnimatedContainerProps {
  animation?: 'fadeIn' | 'scaleIn' | 'slideIn' | 'bounce';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

const getAnimation = (animation: string) => {
  switch (animation) {
    case 'fadeIn':
      return fadeIn;
    case 'scaleIn':
      return scaleIn;
    case 'slideIn':
      return slideIn;
    case 'bounce':
      return bounce;
    default:
      return fadeIn;
  }
};

const Container = styled.div<{
  animation: string;
  delay: number;
  duration: number;
}>`
  animation: ${props => getAnimation(props.animation)} ${props => props.duration}s ease-out forwards;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
`;

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  children
}) => {
  return (
    <Container animation={animation} delay={delay} duration={duration}>
      {children}
    </Container>
  );
}; 