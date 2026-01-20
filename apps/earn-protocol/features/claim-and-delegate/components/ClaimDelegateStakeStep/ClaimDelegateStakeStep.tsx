import { type Dispatch, type FC } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  Button,
  Card,
  DataBlock,
  ERROR_TOAST_CONFIG,
  Icon,
  InputWithDropdown,
  SDKChainIdToAAChainMap,
  SkeletonLine,
  SUCCESS_TOAST_CONFIG,
  TabBar,
  Text,
  useAmount,
  useClientChainId,
  useMobileCheck,
  useUserWallet,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SupportedNetworkIds, UiTransactionStatuses } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatDecimalToBigInt,
  formatFiatBalance,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { base } from 'viem/chains'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { ClaimDelegateActionCard } from '@/features/claim-and-delegate/components/ClaimDelegateActionCard/ClaimDelegateActionCard'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import { useStakeSumrTransaction } from '@/features/claim-and-delegate/hooks/use-stake-sumr-transaction'
import { useUnstakeSumrTransaction } from '@/features/claim-and-delegate/hooks/use-unstake-sumr-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  ClaimDelegateStakeType,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { usePublicClient } from '@/hooks/use-public-client'
import { useRevalidateUser } from '@/hooks/use-revalidate'
import { useTokenBalance } from '@/hooks/use-token-balance'

import { getStakeButtonLabel } from './getStakeButtonLabel'

import classNames from './ClaimDelegateStakeStep.module.css'

const percentageButtons = [0.25, 0.5, 0.75, 1]

interface PercentageButtonsProps {
  onSelect: (percentage: string) => void
  max?: string
}

const PercentageButtons: FC<PercentageButtonsProps> = ({ onSelect, max }) => {
  return (
    <div
      style={{ display: 'flex', gap: 'var(--general-space-8)', flexWrap: 'wrap', width: '100%' }}
    >
      {percentageButtons.map((percentage) => (
        <Button
          variant="secondarySmall"
          key={percentage}
          onClick={() => {
            try {
              // Safely handle potential invalid numbers
              const maxNum = new BigNumber(max ?? 0)

              if (maxNum.isNaN()) {
                // Handle invalid max value
                onSelect('0')
              } else {
                onSelect(maxNum.times(percentage).toString())
              }
            } catch (error) {
              onSelect('0')
            }
          }}
          style={{
            borderRadius: 'var(--general-radius-4)',
            flex: 1,
            ...(percentage === 1 && { backgroundColor: 'var(--earn-protocol-neutral-60)' }),
          }}
        >
          {percentage === 1 ? 'Max' : `${formatDecimalAsPercent(percentage).replace('.00', '')}`}
        </Button>
      ))}
    </div>
  )
}

interface ClaimDelegateStakeStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  sumrPriceUsd: number
}

export const ClaimDelegateStakeStep: FC<ClaimDelegateStakeStepProps> = ({
  state,
  dispatch,
  externalData,
  sumrPriceUsd,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const { userWalletAddress } = useUserWallet()
  const inputChangeHandler = useHandleInputChangeEvent()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string

  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()

  const { publicClient } = usePublicClient({ chain: base })
  const {
    token: sumrToken,
    tokenBalance: sumrBalance,
    tokenBalanceLoading: isSumrBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: 'SUMMER',
    tokenSymbol: 'SUMMER',
    chainId: SupportedNetworkIds.Base,
  })

  const {
    amountRaw: amountRawStake,
    amountParsed: amountParsedStake,
    manualSetAmount: manualSetAmountStake,
    amountDisplay: amountDisplayStake,
    amountDisplayUSD: amountDisplayUSDStake,
    handleAmountChange: handleAmountChangeStake,
    onBlur: onBlurStake,
    onFocus: onFocusStake,
  } = useAmount({
    tokenDecimals: 18,
    tokenPrice: sumrPriceUsd.toString(),
    selectedToken: sumrToken,
    inputChangeHandler,
    inputName: 'stake-amount',
  })

  const {
    amountRaw: amountRawUnstake,
    amountParsed: amountParsedUnstake,
    manualSetAmount: manualSetAmountUnstake,
    amountDisplay: amountDisplayUnstake,
    amountDisplayUSD: amountDisplayUSDUnstake,
    handleAmountChange: handleAmountChangeUnstake,
    onBlur: onBlurUnstake,
    onFocus: onFocusUnstake,
  } = useAmount({
    tokenDecimals: 18,
    tokenPrice: sumrPriceUsd.toString(),
    selectedToken: sumrToken,
    inputChangeHandler,
    inputName: 'unstake-amount',
  })

  const { decayFactor, isLoading: decayFactorLoading } = useDecayFactor(state.delegatee)
  const revalidateUser = useRevalidateUser()

  const { stakeSumrTransaction, approveSumrTransaction, prepareTxs } = useStakeSumrTransaction({
    onStakeSuccess: () => {
      dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.COMPLETED })
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.COMPLETED })

      toast.success('Staked $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
    },
    onApproveSuccess: () => {
      dispatch({
        type: 'update-staking-approve-status',
        payload: UiTransactionStatuses.COMPLETED,
      })

      toast.success('Approved staking $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
    },
    onStakeError: () => {
      dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.FAILED })

      toast.error('Failed to stake $SUMR tokens', ERROR_TOAST_CONFIG)
    },
    onApproveError: () => {
      dispatch({ type: 'update-staking-approve-status', payload: UiTransactionStatuses.FAILED })

      toast.error('Failed to approve staking $SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  const { unstakeSumrTransaction } = useUnstakeSumrTransaction({
    amount: formatDecimalToBigInt(amountRawUnstake),
    onSuccess: () => {
      dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.COMPLETED })
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.COMPLETED })

      toast.success('Unstaked $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
    },
    onError: () => {
      dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.FAILED })

      toast.error('Failed to unstake $SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  const isBase = clientChainId === SupportedNetworkIds.Base

  const handleStake = async () => {
    // staking is only supported on base
    if (!isBase) {
      setChain({ chain: SDKChainIdToAAChainMap[SupportedNetworkIds.Base] })

      return
    }

    // Validate amount before proceeding
    if (amountParsedStake.isZero() || amountParsedStake.toNumber() > Number(sumrBalance)) {
      toast.error('Invalid staking amount', ERROR_TOAST_CONFIG)

      return
    }

    // First prepare the transactions
    const prepared = await prepareTxs(formatDecimalToBigInt(amountRawStake))

    if (!prepared) {
      toast.error('Failed to prepare staking transaction', ERROR_TOAST_CONFIG)

      return
    }

    if (approveSumrTransaction && state.stakingApproveStatus !== UiTransactionStatuses.COMPLETED) {
      dispatch({
        type: 'update-staking-approve-status',
        payload: UiTransactionStatuses.PENDING,
      })

      dispatch({
        type: 'update-stake-change-amount',
        payload: amountParsedStake.toString(),
      })

      await approveSumrTransaction().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error approving staking $SUMR:', err)
      })

      return
    }

    if (stakeSumrTransaction) {
      dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.PENDING })

      await stakeSumrTransaction()
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error staking $SUMR:', err)
        })
        .finally(() => {
          revalidateUser(userWalletAddress)
        })
    }
  }

  const handleUnstake = async () => {
    // unstaking is only supported on base
    if (!isBase) {
      // eslint-disable-next-line no-console
      setChain({ chain: SDKChainIdToAAChainMap[SupportedNetworkIds.Base] })

      return
    }

    dispatch({ type: 'update-staking-status', payload: UiTransactionStatuses.PENDING })

    dispatch({
      type: 'update-stake-change-amount',
      payload: amountParsedUnstake.times(-1).toString(),
    })

    await unstakeSumrTransaction()
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error unstaking $SUMR:', err)
      })
      .finally(() => {
        revalidateUser(userWalletAddress)
      })
  }

  const resolvedButtonAction =
    state.stakeType === ClaimDelegateStakeType.ADD_STAKE ? handleStake : handleUnstake

  const apy = (
    <Text as="h5" variant="h5">
      up to{' '}
      {formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1))}{' '}
      <Text as="span" variant="p4semi">
        APR
      </Text>
    </Text>
  )

  const sumrToClaim =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    externalData.sumrToClaim.aggregatedRewards.perChain[SupportedNetworkIds.Base] ?? 0

  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(sumrToClaim)) * Number(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1)))} SUMR / Year`

  const stakedAmountRaw = Number(externalData.sumrStakeDelegate.stakedAmount)
  const stakedAmountUSD = formatFiatBalance(stakedAmountRaw * sumrPriceUsd)

  const isLoading =
    state.stakingStatus === UiTransactionStatuses.PENDING ||
    state.stakingApproveStatus === UiTransactionStatuses.PENDING ||
    state.delegateStatus === UiTransactionStatuses.PENDING

  const { stakedAmount } = externalData.sumrStakeDelegate

  const withApproval = !!approveSumrTransaction

  const hasNoDelegatee =
    state.delegateStatus === UiTransactionStatuses.COMPLETED
      ? state.delegatee === ADDRESS_ZERO
      : externalData.sumrStakeDelegate.delegatedToV2 === ADDRESS_ZERO

  return (
    <div className={classNames.claimDelegateStakeStepWrapper}>
      <div className={classNames.leftContent}>
        <Card className={classNames.cardWrapper}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Total staked
          </Text>
          <div className={classNames.valueWithIcon}>
            <Icon tokenName="SUMR" />
            <Text as="h4" variant="h4">
              {formatCryptoBalance(stakedAmount)}
            </Text>
          </div>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {`$${stakedAmountUSD}`}
          </Text>
        </Card>
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--general-space-4)' }}>
          Lazy Summer Governance Objectives
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            color: 'var(--earn-protocol-secondary-40)',
            marginBottom: 'var(--general-space-4)',
          }}
        >
          Every delegate declares their governance objectives.
        </Text>
        <Link href="https://forum.summer.fi/c/delegates/19" target="_blank">
          <WithArrow as="p" variant="p3">
            Learn more about Governance
          </WithArrow>
        </Link>
        <div className={classNames.spacer} />
        <DataBlock
          title="Staking Rewards"
          titleStyle={{
            color: 'var(--earn-protocol-secondary-100)',
            marginBottom: 'var(--general-space-8)',
          }}
          titleSize="medium"
          value={
            decayFactorLoading ? (
              <div style={{ marginTop: '9px', marginBottom: '7px)' }}>
                <SkeletonLine height="18px" width="60px" />
              </div>
            ) : (
              apy
            )
          }
          valueStyle={{
            color: 'var(--earn-protocol-success-100)',
            marginBottom: 'var(--general-space-8)',
          }}
          valueSize="small"
          subValue={
            decayFactorLoading ? (
              <div style={{ marginTop: '9px', marginBottom: '7px)' }}>
                <SkeletonLine
                  height="12px"
                  width="80px"
                  style={{
                    marginTop: '6px',
                    marginBottom: 'var(--general-space-4)',
                  }}
                />
              </div>
            ) : (
              sumrPerYear
            )
          }
          subValueStyle={{
            color: 'var(--earn-protocol-primary-100)',
            marginBottom: 'var(--general-space-8)',
          }}
        />
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Earn $SUMR rewards for staking your tokens.
        </Text>
      </div>
      <div className={classNames.rightContent}>
        {hasNoDelegatee ? (
          <ClaimDelegateActionCard
            title="Unable to add or remove staked $SUMR"
            description="You will need to delegate to continue"
            actionLabel="Choose delegate"
            action={() => {
              dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
            }}
          />
        ) : (
          <>
            <TabBar
              tabs={[
                {
                  id: ClaimDelegateStakeType.ADD_STAKE,
                  label: 'Add stake',
                  content: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--general-space-16)',
                      }}
                    >
                      <Card style={{ paddingTop: 0 }}>
                        <InputWithDropdown
                          options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
                          dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
                          value={amountDisplayStake}
                          secondaryValue={amountDisplayUSDStake}
                          onFocus={onFocusStake}
                          onBlur={onBlurStake}
                          handleChange={(value) => {
                            handleAmountChangeStake(value)
                            prepareTxs(formatDecimalToBigInt(value.target.value))
                          }}
                          handleDropdownChange={() => null}
                          heading={{
                            label: 'Balance',
                            value: isSumrBalanceLoading ? (
                              <SkeletonLine width={60} height={10} />
                            ) : sumrBalance ? (
                              `${formatCryptoBalance(sumrBalance)} SUMR`
                            ) : (
                              '-'
                            ),
                            action: () => {
                              if (sumrBalance) {
                                const formatted = formatCryptoBalance(sumrBalance)

                                manualSetAmountStake(sumrBalance.toString())
                                prepareTxs(formatDecimalToBigInt(formatted))
                              }
                            },
                          }}
                          disabled={isLoading}
                        />
                      </Card>
                      <PercentageButtons
                        onSelect={(value) => {
                          manualSetAmountStake(value)
                          prepareTxs(formatDecimalToBigInt(value))
                        }}
                        max={sumrBalance?.toString()}
                      />
                    </div>
                  ),
                },
                {
                  id: ClaimDelegateStakeType.REMOVE_STAKE,
                  label: 'Remove stake',
                  content: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--general-space-16)',
                      }}
                    >
                      <Card style={{ paddingTop: 0 }}>
                        <InputWithDropdown
                          options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
                          dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
                          value={amountDisplayUnstake}
                          secondaryValue={amountDisplayUSDUnstake}
                          onFocus={onFocusUnstake}
                          onBlur={onBlurUnstake}
                          handleChange={handleAmountChangeUnstake}
                          handleDropdownChange={() => null}
                          heading={{
                            label: 'Balance',
                            value: `${formatCryptoBalance(stakedAmount)} SUMR`,
                            action: () => {
                              if (stakedAmount) {
                                manualSetAmountUnstake(stakedAmount)
                              }
                            },
                          }}
                          disabled={isLoading}
                        />
                      </Card>
                      <PercentageButtons
                        onSelect={(value) => {
                          manualSetAmountUnstake(value)
                        }}
                        max={stakedAmount}
                      />
                    </div>
                  ),
                },
              ]}
              handleTabChange={(_tab) => {
                dispatch({ type: 'update-stake-type', payload: _tab.id as ClaimDelegateStakeType })
                if (
                  [state.stakingApproveStatus, state.stakingStatus].includes(
                    UiTransactionStatuses.FAILED,
                  )
                ) {
                  dispatch({ type: 'update-staking-status', payload: undefined })
                  dispatch({ type: 'update-staking-approve-status', payload: undefined })
                }
              }}
            />
            <div className={classNames.buttonsWrapper}>
              <Button
                variant="secondarySmall"
                onClick={() => {
                  dispatch({
                    type: 'update-stake-change-amount',
                    payload: undefined,
                  })
                  dispatch({ type: 'update-step', payload: ClaimDelegateSteps.COMPLETED })
                }}
                disabled={isLoading}
              >
                <Text variant="p3semi" as="p">
                  Skip
                </Text>
              </Button>
              <Button
                variant="primarySmall"
                style={{ paddingRight: 'var(--general-space-32)' }}
                onClick={resolvedButtonAction}
                disabled={
                  isBase &&
                  (isLoading ||
                    userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase() ||
                    (state.stakeType === ClaimDelegateStakeType.REMOVE_STAKE &&
                      amountParsedUnstake.isZero()) ||
                    (state.stakeType === ClaimDelegateStakeType.ADD_STAKE &&
                      amountParsedStake.isZero()) ||
                    (state.stakeType === ClaimDelegateStakeType.REMOVE_STAKE &&
                      amountParsedUnstake.toNumber() > Number(stakedAmount)) ||
                    (state.stakeType === ClaimDelegateStakeType.ADD_STAKE &&
                      amountParsedStake.toNumber() > Number(sumrBalance)))
                }
              >
                <WithArrow
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                  variant="p3semi"
                  as="p"
                  isLoading={isLoading}
                >
                  {getStakeButtonLabel({
                    state,
                    withApproval,
                    isBase,
                    isMobile,
                  })}
                </WithArrow>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
