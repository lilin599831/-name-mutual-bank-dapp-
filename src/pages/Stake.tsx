import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import { useStaking } from '../hooks/useStaking';
import { useToken } from '../hooks/useToken';
import { useNotification } from '../contexts/NotificationContext';
import { useStakes } from '../hooks/useStakes';
import { useReferrer } from '../hooks/useReferrer';
import { useUserInfo } from '../hooks/useUserInfo';
import { useContract } from '../hooks/useContract';
import { MUTUAL_BANK_ABI } from '../contracts/abi';
import { ethers } from 'ethers';
import { formatTokenAmount } from '../utils/format';
import { ConnectWalletCard } from '../components/ConnectWalletCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatedContainer } from '../components/AnimatedContainer';
import { validateForm, ValidationRules } from '../utils/validation';
import { useLanguage } from '../contexts/LanguageContext';
import { CenterContainer, CommonCard } from '../components/CommonStyles';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 auto 16px;
    max-width: calc(100vw - 32px);
  }
`;

const StakeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const StakeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #fff;
  margin: 0;
`;

const AddressDisplay = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  backdrop-filter: blur(5px);
`;

const StakeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 auto 16px;
    max-width: calc(100vw - 32px);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 5px 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StakesList = styled.div`
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const StakeItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 8px;
    flex-direction: column;
    gap: 12px;
  }
`;

const StakeInfo = styled.div`
  flex: 1;
`;

const StakeAmount = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StakeDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WithdrawButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const WithdrawInfo = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const ReferrerStatus = styled.div<{ $active: boolean }>`
  color: ${props => props.$active ? '#2ecc71' : '#e74c3c'};
  font-size: 14px;
  margin: 5px 0;
`;

const PageWrapper = styled.div<{ isLocked: boolean }>`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: ${props => props.isLocked ? 'fixed' : 'relative'};
  overflow-y: ${props => props.isLocked ? 'hidden' : 'auto'};
  padding: 20px;
  box-sizing: border-box;
`;

const CardWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1001;
`;

const translations = {
  zh: {
    title: '质押',
    connected: '已连接：',
    stake: '质押',
    withdraw: '赎回',
    withdrawFee: '赎回手续费',
    pendingRewards: '待领取收益',
    stakeRate: '质押利率',
    stakeTime: '质押时间',
    inputAmount: '输入质押数量',
    inputReferrer: '输入推荐人钱包地址',
    availableBalance: '可用余额',
    currentReferrer: '当前推荐人地址',
    referrerStatus: '推荐人状态',
    referrerActive: '活跃',
    referrerInactive: '不活跃',
    connectPrompt: '连接钱包后即可进行质押操作，赚取稳定收益。',
    minStakeError: '最小质押数量为100 MBT',
    insufficientBalance: '余额不足',
    selfReferralError: '不能将自己设置为推荐人',
    referrerRequired: '请输入推荐人地址',
    invalidAmount: '请输入有效的数字，最小质押数量为100 MBT',
    invalidReferrer: '请输入有效的推荐人地址',
    checkInput: '请检查输入',
    stakeSuccess: '质押成功',
    userCancelStake: '用户取消质押',
    stakeFailed: '质押失败',
    withdrawSuccess: '赎回成功',
    userCancelWithdraw: '用户取消赎回',
    withdrawFailed: '赎回失败',
    claimSuccess: '领取收益成功',
    userCancelClaim: '用户取消领取',
    claimFailed: '领取收益失败',
    claimAllRewards: '领取所有收益',
    myStakes: '我的质押',
    yieldManagement: '收益管理',
    totalPendingRewards: '可领取总收益',
    unit: 'MBT',
    stakeToken: '质押代币',
    totalRewards: '可领取总收益',
    stakeDetails: '质押详情',
    stakeAmount: '质押数量',
    stakeStartTime: '质押开始时间',
    stakeStatus: '质押状态',
    active: '进行中',
    inactive: '已结束',
    processing: '处理中...',
    approving: '授权中...',
    staking: '质押中...',
    withdrawing: '赎回中...',
    claiming: '领取中...'
  },
  en: {
    title: 'Stake',
    connected: 'Connected: ',
    stake: 'Stake',
    withdraw: 'Withdraw',
    withdrawFee: 'Withdrawal Fee',
    pendingRewards: 'Pending Rewards',
    stakeRate: 'Stake Rate',
    stakeTime: 'Stake Time',
    inputAmount: 'Enter stake amount',
    inputReferrer: 'Enter referrer wallet address',
    availableBalance: 'Available Balance',
    currentReferrer: 'Current Referrer Address',
    referrerStatus: 'Referrer Status',
    referrerActive: 'Active',
    referrerInactive: 'Inactive',
    connectPrompt: 'Connect your wallet to start staking and earn stable rewards.',
    minStakeError: 'Minimum stake amount is 100 MBT',
    insufficientBalance: 'Insufficient balance',
    selfReferralError: 'Cannot set yourself as referrer',
    referrerRequired: 'Please enter referrer address',
    invalidAmount: 'Please enter a valid number, minimum stake amount is 100 MBT',
    invalidReferrer: 'Please enter a valid referrer address',
    checkInput: 'Please check your input',
    stakeSuccess: 'Stake successful',
    userCancelStake: 'User cancelled staking',
    stakeFailed: 'Stake failed',
    withdrawSuccess: 'Withdrawal successful',
    userCancelWithdraw: 'User cancelled withdrawal',
    withdrawFailed: 'Withdrawal failed',
    claimSuccess: 'Rewards claimed successfully',
    userCancelClaim: 'User cancelled claim',
    claimFailed: 'Failed to claim rewards',
    claimAllRewards: 'Claim All Rewards',
    myStakes: 'My Stakes',
    yieldManagement: 'Yield Management',
    totalPendingRewards: 'Total Pending Rewards',
    unit: 'MBT',
    stakeToken: 'Stake Token',
    totalRewards: 'Total Claimable Rewards',
    stakeDetails: 'Stake Details',
    stakeAmount: 'Stake Amount',
    stakeStartTime: 'Stake Start Time',
    stakeStatus: 'Stake Status',
    active: 'Active',
    inactive: 'Inactive',
    processing: 'Processing...',
    approving: 'Approving...',
    staking: 'Staking...',
    withdrawing: 'Withdrawing...',
    claiming: 'Claiming...'
  },
  ja: {
    title: 'ステーキング',
    connected: '接続済み：',
    stake: 'ステーク',
    withdraw: '引き出し',
    withdrawFee: '引き出し手数料',
    pendingRewards: '保留中の報酬',
    stakeRate: 'ステーク率',
    stakeTime: 'ステーク時間',
    inputAmount: 'ステーク量を入力',
    inputReferrer: '紹介者のウォレットアドレスを入力',
    availableBalance: '利用可能残高',
    currentReferrer: '現在の紹介者アドレス',
    referrerStatus: '紹介者ステータス',
    referrerActive: 'アクティブ',
    referrerInactive: '非アクティブ',
    connectPrompt: 'ウォレットを接続してステーキングを開始し、安定した報酬を獲得しましょう。',
    minStakeError: '最小ステーク量は100 MBTです',
    insufficientBalance: '残高不足',
    selfReferralError: '自分自身を紹介者として設定できません',
    referrerRequired: '紹介者アドレスを入力してください',
    invalidAmount: '有効な数値を入力してください。最小ステーク量は100 MBTです',
    invalidReferrer: '有効な紹介者アドレスを入力してください',
    checkInput: '入力内容を確認してください',
    stakeSuccess: 'ステーク成功',
    userCancelStake: 'ユーザーがステーキングをキャンセルしました',
    stakeFailed: 'ステーク失敗',
    withdrawSuccess: '引き出し成功',
    userCancelWithdraw: 'ユーザーが引き出しをキャンセルしました',
    withdrawFailed: '引き出し失敗',
    claimSuccess: '報酬の請求に成功しました',
    userCancelClaim: 'ユーザーが請求をキャンセルしました',
    claimFailed: '報酬の請求に失敗しました',
    claimAllRewards: '全ての報酬を請求',
    myStakes: '私のステーク',
    yieldManagement: '収益管理',
    totalPendingRewards: '請求可能な総報酬',
    unit: 'MBT',
    stakeToken: 'ステークトークン',
    totalRewards: '請求可能な総報酬',
    stakeDetails: 'ステーク詳細',
    stakeAmount: 'ステーク量',
    stakeStartTime: 'ステーク開始時間',
    stakeStatus: 'ステークステータス',
    active: 'アクティブ',
    inactive: '非アクティブ',
    processing: '処理中...',
    approving: '承認中...',
    staking: 'ステーク中...',
    withdrawing: '引き出し中...',
    claiming: '請求中...'
  },
  ko: {
    title: '스테이킹',
    connected: '연결됨: ',
    stake: '스테이크',
    withdraw: '출금',
    withdrawFee: '출금 수수료',
    pendingRewards: '대기 중인 보상',
    stakeRate: '스테이크 비율',
    stakeTime: '스테이크 시간',
    inputAmount: '스테이크 금액 입력',
    inputReferrer: '추천인 지갑 주소 입력',
    availableBalance: '사용 가능한 잔액',
    currentReferrer: '현재 추천인 주소',
    referrerStatus: '추천인 상태',
    referrerActive: '활성',
    referrerInactive: '비활성',
    connectPrompt: '지갑을 연결하여 스테이킹을 시작하고 안정적인 보상을 얻으세요.',
    minStakeError: '최소 스테이크 금액은 100 MBT입니다',
    insufficientBalance: '잔액 부족',
    selfReferralError: '자신을 추천인으로 설정할 수 없습니다',
    referrerRequired: '추천인 주소를 입력해주세요',
    invalidAmount: '유효한 숫자를 입력해주세요. 최소 스테이크 금액은 100 MBT입니다',
    invalidReferrer: '유효한 추천인 주소를 입력해주세요',
    checkInput: '입력 내용을 확인해주세요',
    stakeSuccess: '스테이크 성공',
    userCancelStake: '사용자가 스테이킹을 취소했습니다',
    stakeFailed: '스테이크 실패',
    withdrawSuccess: '출금 성공',
    userCancelWithdraw: '사용자가 출금을 취소했습니다',
    withdrawFailed: '출금 실패',
    claimSuccess: '보상 청구 성공',
    userCancelClaim: '사용자가 청구를 취소했습니다',
    claimFailed: '보상 청구 실패',
    claimAllRewards: '모든 보상 청구',
    myStakes: '내 스테이크',
    yieldManagement: '수익 관리',
    totalPendingRewards: '청구 가능한 총 보상',
    unit: 'MBT',
    stakeToken: '스테이크 토큰',
    totalRewards: '청구 가능한 총 보상',
    stakeDetails: '스테이크 상세',
    stakeAmount: '스테이크 금액',
    stakeStartTime: '스테이크 시작 시간',
    stakeStatus: '스테이크 상태',
    active: '활성',
    inactive: '비활성',
    processing: '처리 중...',
    approving: '승인 중...',
    staking: '스테이크 중...',
    withdrawing: '출금 중...',
    claiming: '청구 중...'
  }
};

export const Stake: React.FC = () => {
  const { account } = useWeb3();
  const { stake, withdraw, claimRewards } = useStaking();
  const { getBalance } = useToken();
  const { showNotification } = useNotification();
  const { stakes, refresh: refreshStakes, totalPendingRewards } = useStakes();
  const { hasReferrer, fetchReferrer } = useReferrer();
  const { userInfo } = useUserInfo();
  const { getContract } = useContract(MUTUAL_BANK_ABI);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const validationRules: ValidationRules = {
    amount: {
      required: true,
      pattern: /^\d+(\.\d{1,18})?$/,
      min: 100,
      message: t.invalidAmount
    },
    referrer: {
      required: false,
      pattern: /^0x[a-fA-F0-9]{40}$/,
      message: t.invalidReferrer
    }
  };

  const [amount, setAmount] = useState('');
  const [referrerAddress, setReferrerAddress] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refAddress = urlParams.get('ref');
    if (refAddress && ethers.utils.isAddress(refAddress)) {
      return refAddress;
    }
    return '';
  });
  const [balance, setBalance] = useState('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState<number | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReferrerActive, setIsReferrerActive] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refAddress = params.get('ref');
    
    if (refAddress && ethers.utils.isAddress(refAddress)) {
      setReferrerAddress(refAddress);
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchReferrer();
    }
  }, [account, fetchReferrer]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getBalance(account);
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [account, getBalance]);

  useEffect(() => {
    const checkReferrerStatus = async (address: string) => {
      if (!address || !ethers.utils.isAddress(address)) {
        setIsReferrerActive(false);
        return;
      }

      try {
        const contract = getContract();
        if (!contract) {
          return;
        }
        
        const userInfo = await contract.getUserInfo(address);
        const stakes = await contract.getUserStakes(address);
        const hasActiveStakes = stakes.some((stake: any) => stake.active);
        
        setIsReferrerActive(hasActiveStakes);
      } catch (err) {
        setIsReferrerActive(false);
      }
    };

    if (referrerAddress) {
      checkReferrerStatus(referrerAddress);
    }
  }, [referrerAddress, getContract]);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm({ amount, referrer: referrerAddress }, validationRules);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showNotification('error', t.checkInput);
      return;
    }

    if (Number(amount) < 100) {
      showNotification('error', t.minStakeError);
      return;
    }

    if (Number(amount) > Number(balance)) {
      showNotification('error', t.insufficientBalance);
      return;
    }

    if (referrerAddress && referrerAddress.toLowerCase() === account?.toLowerCase()) {
      showNotification('error', t.selfReferralError);
      return;
    }

    // 检查用户是否已有推荐人
    const hasExistingReferrer = userInfo?.referrer && userInfo.referrer !== ethers.constants.AddressZero;

    // 只在用户没有推荐人且正在设置新推荐人时检查推荐人状态
    if (!hasExistingReferrer && !referrerAddress) {
      showNotification('error', t.referrerRequired);
      return;
    }

    setIsStaking(true);
    try {
      // 如果用户已有推荐人，使用现有推荐人地址；否则使用新输入的推荐人地址
      const finalReferrer = hasExistingReferrer ? userInfo?.referrer : referrerAddress;
      console.log('最终使用的推荐人地址:', finalReferrer);
      
      const success = await stake(amount, finalReferrer, {
        onApproving: () => {
          setIsApproving(true);
        },
        onStaking: () => {
          setIsApproving(false);
        }
      });
      if (success) {
        showNotification('success', t.stakeSuccess);
        setAmount('');
        setReferrerAddress('');
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', t.userCancelStake);
      } else {
        showNotification('error', error.message || t.stakeFailed);
      }
    } finally {
      setIsStaking(false);
      setIsApproving(false);
    }
  };

  const handleWithdraw = async (stakeIndex: number) => {
    setIsWithdrawing(stakeIndex);
    try {
      const success = await withdraw(stakeIndex);
      if (success) {
        showNotification('success', t.withdrawSuccess);
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', t.userCancelWithdraw);
      } else {
        showNotification('error', error.message || t.withdrawFailed);
      }
    } finally {
      setIsWithdrawing(null);
    }
  };

  const handleClaimRewards = async () => {
    setIsClaiming(true);
    try {
      const success = await claimRewards();
      if (success) {
        showNotification('success', t.claimSuccess);
        refreshStakes();
      }
    } catch (error: any) {
      if (error.code === 4001) {
        showNotification('error', t.userCancelClaim);
      } else {
        showNotification('error', error.message || t.claimFailed);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${t.connected}${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <>
        <GlobalStyle />
        <PageWrapper isLocked={!account}>
          <CardWrapper>
            <ConnectWalletCard />
          </CardWrapper>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>{t.title}</Title>
          <Form onSubmit={handleStake}>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors({});
              }}
              placeholder={t.inputAmount}
              error={errors.amount}
              fullWidth
              disabled={isStaking || isWithdrawing !== null || isClaiming}
            />
            {!hasReferrer && (
              <>
                <Input
                  type="text"
                  value={referrerAddress}
                  onChange={(e) => {
                    setReferrerAddress(e.target.value);
                    setErrors({});
                  }}
                  placeholder={t.inputReferrer}
                  error={errors.referrer}
                  fullWidth
                  disabled={isStaking || isWithdrawing !== null || isClaiming}
                />
                {referrerAddress && (
                  <>
                    <InfoText>{t.currentReferrer}: {referrerAddress}</InfoText>
                    <ReferrerStatus $active={Boolean(isReferrerActive)}>
                      {isReferrerActive ? t.referrerActive : t.referrerInactive}
                    </ReferrerStatus>
                  </>
                )}
              </>
            )}
            <InfoText>{t.availableBalance}: {formatTokenAmount(balance)} {t.unit}</InfoText>
            <ButtonGroup>
              <Button
                type="submit"
                variant="primary"
                loading={isStaking}
                disabled={isWithdrawing !== null || isClaiming}
                fullWidth
              >
                {isApproving ? t.approving : isStaking ? t.staking : t.stake}
              </Button>
            </ButtonGroup>
          </Form>
        </Card>

        <Card>
          <Title>{t.yieldManagement}</Title>
          <InfoText>{t.totalRewards}: {formatTokenAmount(totalPendingRewards)} {t.unit}</InfoText>
          <ButtonGroup>
            <Button
              type="button"
              variant="primary"
              onClick={handleClaimRewards}
              loading={isClaiming}
              disabled={isStaking || isWithdrawing !== null}
              fullWidth
            >
              {isClaiming ? t.claiming : t.claimAllRewards}
            </Button>
          </ButtonGroup>
        </Card>

        {stakes.length > 0 && (
          <Card>
            <Title>{t.myStakes}</Title>
            <StakesList>
              {stakes.map((stake, index) => (
                <StakeItem key={index}>
                  <StakeInfo>
                    <StakeAmount>{formatTokenAmount(stake.amount)} {t.unit}</StakeAmount>
                    <StakeDetails>
                      <div>{t.stakeTime}: {new Date(stake.startTime * 1000).toLocaleString()}</div>
                      <div>{t.stakeRate}: {stake.rate}%</div>
                      <div>{t.pendingRewards}: {formatTokenAmount(stake.pendingRewards)} {t.unit}</div>
                      <div>{t.withdrawFee}: {formatTokenAmount(stake.withdrawFee)} {t.unit}</div>
                    </StakeDetails>
                  </StakeInfo>
                  <WithdrawButton
                    variant="primary"
                    onClick={() => handleWithdraw(index)}
                    loading={isWithdrawing === index}
                    disabled={isStaking || isClaiming}
                  >
                    {isWithdrawing === index ? t.withdrawing : t.withdraw}
                    <WithdrawInfo>{t.withdrawFee}: {formatTokenAmount(stake.withdrawFee)} {t.unit}</WithdrawInfo>
                  </WithdrawButton>
                </StakeItem>
              ))}
            </StakesList>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Stake; 