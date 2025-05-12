import React from 'react';

export const MutualBankLogo: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3498db" />
        <stop offset="100%" stopColor="#2ecc71" />
      </linearGradient>
      <path id="arc" d="M 120 400 A 200 200 0 0 1 392 400" />
    </defs>
    {/* 渐变圆背景 */}
    <circle cx="256" cy="256" r="240" fill="url(#logo-gradient)" />
    {/* 白色环形（有缺口） */}
    <path d="M 136 256 a 120 120 0 1 1 240 0" stroke="#fff" strokeWidth="32" fill="none" strokeLinecap="round" />
    {/* 握手图标（精细） */}
    <g>
      <path d="M 200 250 l 30 30 q 10 10 20 0 l 30 -30 q 10 -10 20 0 l 30 30" stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round" />
      <rect x="220" y="230" width="72" height="36" rx="12" fill="#fff" opacity="0.9" />
      {/* 手指细节 */}
      <path d="M 230 250 l 8 16" stroke="#3498db" strokeWidth="6" strokeLinecap="round" />
      <path d="M 245 255 l 7 14" stroke="#3498db" strokeWidth="6" strokeLinecap="round" />
      <path d="M 260 260 l 6 12" stroke="#3498db" strokeWidth="6" strokeLinecap="round" />
      <path d="M 275 265 l 5 10" stroke="#3498db" strokeWidth="6" strokeLinecap="round" />
    </g>
    {/* 弧形文字 */}
    <text fontSize="40" fontWeight="bold" fill="#fff" letterSpacing="8" fontFamily="Arial, sans-serif">
      <textPath xlinkHref="#arc" startOffset="0%">MUTUAL BANK</textPath>
    </text>
  </svg>
); 