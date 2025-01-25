import { type Dispatch, type FC, useState } from 'react'
import {
  Button,
  Card,
  DataBlock,
  Icon,
  InputWithDropdown,
  SkeletonLine,
  SUMR_CAP,
  TabBar,
  Text,
  useAmount,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { base } from 'viem/chains'

import { ClaimDelegateActionCard } from '@/features/claim-and-delegate/components/ClaimDelegateActionCard/ClaimDelegateActionCard'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { usePublicClient } from '@/hooks/use-public-client'
import { useStakeSumrTransaction } from '@/hooks/use-stake-sumr-transaction'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useUnstakeSumrTransaction } from '@/hooks/use-unstake-sumr-transaction'
import { useUserWallet } from '@/hooks/use-user-wallet'

import { getStakeButtonLabel } from './getStakeButtonLabel'
import { ClaimDelegateStakeStepTabs } from './types'

import classNames from './ClaimDelegateStakeStep.module.scss'

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
          onClick={() => onSelect((Number(max ?? 1) * percentage).toString())}
          style={{
            borderRadius: 'var(--general-radius-4)',
            flex: 1,
            ...(percentage === 1 && { backgroundColor: 'var(--earn-protocol-neutral-60)' }),
          }}
        >
          {percentage === 1 ? 'Max' : `${percentage}%`}
        </Button>
      ))}
    </div>
  )
}

interface ClaimDelegateStakeStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateStakeStep: FC<ClaimDelegateStakeStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const [tab, setTab] = useState<ClaimDelegateStakeStepTabs>(ClaimDelegateStakeStepTabs.ADD_STAKE)

  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { userWalletAddress } = useUserWallet()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = Array.isArray(walletAddress) ? walletAddress[0] : walletAddress

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const { publicClient } = usePublicClient({ chain: base })
  const {
    token: sumrToken,
    tokenBalance: sumrBalance,
    tokenBalanceLoading: isSumrBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: 'SUMMER',
    tokenSymbol: 'SUMMER',
    chainId: SDKChainId.BASE,
  })

  const {
    amountParsed: amountParsedStake,
    manualSetAmount: manualSetAmountStake,
    amountDisplay: amountDisplayStake,
    amountDisplayUSD: amountDisplayUSDStake,
    handleAmountChange: handleAmountChangeStake,
    onBlur: onBlurStake,
    onFocus: onFocusStake,
  } = useAmount({
    tokenDecimals: 18,
    tokenPrice: estimatedSumrPrice.toString(),
    selectedToken: sumrToken,
  })

  const {
    amountParsed: amountParsedUnstake,
    manualSetAmount: manualSetAmountUnstake,
    amountDisplay: amountDisplayUnstake,
    amountDisplayUSD: amountDisplayUSDUnstake,
    handleAmountChange: handleAmountChangeUnstake,
    onBlur: onBlurUnstake,
    onFocus: onFocusUnstake,
  } = useAmount({
    tokenDecimals: 18,
    tokenPrice: estimatedSumrPrice.toString(),
    selectedToken: sumrToken,
  })

  const { decayFactor, isLoading: decayFactorLoading } = useDecayFactor(state.delegatee)

  const { stakeSumrTransaction, approveSumrTransaction } = useStakeSumrTransaction({
    amount: amountParsedStake.shiftedBy(18).toNumber(),
    onStakeSuccess: () => {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.COMPLETED })
    },
    onApproveSuccess: () => {
      dispatch({
        type: 'update-staking-approve-status',
        payload: ClaimDelegateTxStatuses.COMPLETED,
      })
    },
    onStakeError: () => {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.FAILED })
    },
    onApproveError: () => {
      dispatch({ type: 'update-staking-approve-status', payload: ClaimDelegateTxStatuses.FAILED })
    },
  })

  const { unstakeSumrTransaction } = useUnstakeSumrTransaction({
    amount: amountParsedUnstake.shiftedBy(18).toNumber(),
    onSuccess: () => {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.COMPLETED })
    },
    onError: () => {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.FAILED })
    },
  })

  const handleStake = async () => {
    if (
      approveSumrTransaction &&
      state.stakingApproveStatus !== ClaimDelegateTxStatuses.COMPLETED
    ) {
      dispatch({
        type: 'update-staking-approve-status',
        payload: ClaimDelegateTxStatuses.PENDING,
      })

      await approveSumrTransaction().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error approving staking SUMR:', err)
      })

      return
    }

    if (stakeSumrTransaction) {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.PENDING })

      await stakeSumrTransaction().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error staking SUMR:', err)
      })
    }
  }

  const handleUnstake = async () => {
    if (unstakeSumrTransaction) {
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.PENDING })

      await unstakeSumrTransaction().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error unstaking SUMR:', err)
      })
    }
  }

  const resolvedButtonAction =
    tab === ClaimDelegateStakeStepTabs.ADD_STAKE ? handleStake : handleUnstake

  const apy = (
    <Text as="h5" variant="h5">
      up to{' '}
      {formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1))}{' '}
      <Text as="span" variant="p4semi">
        APY
      </Text>
    </Text>
  )

  const sumrToClaim = externalData.sumrToClaim.perChain[SDKChainId.BASE] ?? 0

  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(sumrToClaim)) * Number(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1)))} $SUMR / Year`

  const stakedAmountRaw = Number(externalData.sumrStakeDelegate.stakedAmount)
  const stakedAmountUSD = formatFiatBalance(stakedAmountRaw * estimatedSumrPrice)

  const isLoading =
    state.stakingStatus === ClaimDelegateTxStatuses.PENDING ||
    state.stakingApproveStatus === ClaimDelegateTxStatuses.PENDING ||
    state.delegateStatus === ClaimDelegateTxStatuses.PENDING

  const { stakedAmount } = externalData.sumrStakeDelegate

  const withApproval = !!approveSumrTransaction

  const hasNoDelegatee =
    state.delegatee === ADDRESS_ZERO || !externalData.sumrStakeDelegate.delegatedTo

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
        <Link href="/" target="_blank">
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
              <SkeletonLine
                height="18px"
                width="60px"
                style={{ marginTop: '7px', marginBottom: '7px)' }}
              />
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
              <SkeletonLine
                height="12px"
                width="80px"
                style={{
                  marginTop: '6px',
                  marginBottom: 'var(--general-space-4)',
                }}
              />
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
          Earn $SUMR rewards for staking and delegating your tokens.
        </Text>
      </div>
      <div className={classNames.rightContent}>
        {hasNoDelegatee ? (
          <ClaimDelegateActionCard
            title="Unable to add or remove staked SUMR"
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
                  id: ClaimDelegateStakeStepTabs.ADD_STAKE,
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
                      <Card style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <InputWithDropdown
                          options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
                          dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
                          value={amountDisplayStake}
                          secondaryValue={amountDisplayUSDStake}
                          onFocus={onFocusStake}
                          onBlur={onBlurStake}
                          handleChange={handleAmountChangeStake}
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
                                manualSetAmountStake(sumrBalance.toString())
                              }
                            },
                          }}
                          disabled={isLoading}
                        />
                      </Card>
                      <PercentageButtons
                        onSelect={(value) => manualSetAmountStake(value)}
                        max={sumrBalance?.toString()}
                      />
                    </div>
                  ),
                },
                {
                  id: ClaimDelegateStakeStepTabs.REMOVE_STAKE,
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
                      <Card style={{ paddingTop: 0, paddingBottom: 0 }}>
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
                                manualSetAmountUnstake(stakedAmount.toString())
                              }
                            },
                          }}
                          disabled={isLoading}
                        />
                      </Card>
                      <PercentageButtons
                        onSelect={(value) => manualSetAmountUnstake(value)}
                        max={stakedAmount}
                      />
                    </div>
                  ),
                },
              ]}
              handleTabChange={(_tab) => {
                setTab(_tab.id as ClaimDelegateStakeStepTabs)
                if (
                  [state.stakingApproveStatus, state.stakingStatus].includes(
                    ClaimDelegateTxStatuses.FAILED,
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
                  isLoading ||
                  userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase() ||
                  (tab === ClaimDelegateStakeStepTabs.REMOVE_STAKE &&
                    amountParsedUnstake.isZero()) ||
                  (tab === ClaimDelegateStakeStepTabs.ADD_STAKE && amountParsedStake.isZero()) ||
                  (tab === ClaimDelegateStakeStepTabs.REMOVE_STAKE &&
                    amountParsedUnstake.toNumber() > Number(stakedAmount)) ||
                  (tab === ClaimDelegateStakeStepTabs.ADD_STAKE &&
                    amountParsedStake.toNumber() > Number(sumrBalance))
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
                    tab,
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
