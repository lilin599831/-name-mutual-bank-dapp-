import React, { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import styled from 'styled-components';

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

const Stake = () => {
  const { userInfo, loading: userInfoLoading } = useUserInfo();

  return (
    <StakeContainer>
      <StakeCard>
        <StakeHeader>
          <h2>质押</h2>
          <div className="user-info">
            <div className="info-item">
              <span>我的质押量：</span>
              <span>{userInfo?.totalStaked || '0'} MBT</span>
            </div>
            <div className="info-item">
              <span>推荐总质押量：</span>
              <span>{userInfo?.totalReferred || '0'} MBT</span>
            </div>
          </div>
        </StakeHeader>
      </StakeCard>
    </StakeContainer>
  );
};

export default Stake; 