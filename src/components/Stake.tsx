import React, { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const StakeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const StakeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const StakeHeader = styled.div`
  margin-bottom: 30px;

  h2 {
    color: #fff;
    margin-bottom: 20px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 16px;
  }
`;

const translations = {
  zh: {
    title: '质押',
    myStake: '我的质押量',
    totalReferral: '推荐总质押量',
    unit: 'MBT',
    inputPlaceholder: '请输入质押数量',
    minStakeAmount: '请输入有效的数字，最小质押数量为100 MBT',
    invalidAmount: '无效的质押数量',
    insufficientBalance: '余额不足',
    stakeSuccess: '质押成功',
    stakeFailed: '质押失败',
    stakeProcessing: '质押处理中',
    stakeConfirm: '确认质押',
    available: '可用余额',
    stake: '质押',
    unstake: '赎回'
  },
  en: {
    title: 'Stake',
    myStake: 'My Stake',
    totalReferral: 'Total Referral Stake',
    unit: 'MBT',
    inputPlaceholder: 'Enter stake amount',
    minStakeAmount: 'Please enter a valid number, minimum stake amount is 100 MBT',
    invalidAmount: 'Invalid stake amount',
    insufficientBalance: 'Insufficient balance',
    stakeSuccess: 'Stake successful',
    stakeFailed: 'Stake failed',
    stakeProcessing: 'Processing stake',
    stakeConfirm: 'Confirm Stake',
    available: 'Available Balance',
    stake: 'Stake',
    unstake: 'Unstake'
  },
  ja: {
    title: 'ステーキング',
    myStake: '私のステーク量',
    totalReferral: '紹介者総ステーク量',
    unit: 'MBT',
    inputPlaceholder: 'ステーク量を入力',
    minStakeAmount: '有効な数値を入力してください。最小ステーク量は100 MBTです',
    invalidAmount: '無効なステーク量',
    insufficientBalance: '残高不足',
    stakeSuccess: 'ステーク成功',
    stakeFailed: 'ステーク失敗',
    stakeProcessing: 'ステーク処理中',
    stakeConfirm: 'ステーク確認',
    available: '利用可能残高',
    stake: 'ステーク',
    unstake: '解除'
  },
  ko: {
    title: '스테이킹',
    myStake: '내 스테이크',
    totalReferral: '추천 총 스테이크',
    unit: 'MBT',
    inputPlaceholder: '스테이크 수량 입력',
    minStakeAmount: '유효한 숫자를 입력하세요. 최소 스테이크 수량은 100 MBT입니다',
    invalidAmount: '유효하지 않은 스테이크 수량',
    insufficientBalance: '잔액 부족',
    stakeSuccess: '스테이크 성공',
    stakeFailed: '스테이크 실패',
    stakeProcessing: '스테이크 처리 중',
    stakeConfirm: '스테이크 확인',
    available: '사용 가능 잔액',
    stake: '스테이크',
    unstake: '해제'
  }
};

const Stake = () => {
  const { userInfo, loading: userInfoLoading } = useUserInfo();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <StakeContainer>
      <StakeCard>
        <StakeHeader>
          <h2>{t.title}</h2>
          <div className="user-info">
            <div className="info-item">
              <span>{t.myStake}：</span>
              <span>{userInfo?.totalStaked || '0'} {t.unit}</span>
            </div>
            <div className="info-item">
              <span>{t.totalReferral}：</span>
              <span>{userInfo?.totalReferred || '0'} {t.unit}</span>
            </div>
          </div>
        </StakeHeader>
      </StakeCard>
    </StakeContainer>
  );
};

export default Stake; 