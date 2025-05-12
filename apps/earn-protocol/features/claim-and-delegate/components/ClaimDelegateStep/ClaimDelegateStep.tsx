import { type ChangeEvent, type Dispatch, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain, useUser } from '@account-kit/react'
import {
  Button,
  Card,
  DataBlock,
  Dropdown,
  Icon,
  Input,
  SkeletonLine,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type DropdownRawOption, SDKChainId } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  formatAddress,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { AccountKitAccountType } from '@/account-kit/types'
import { ClaimDelegateActionCard } from '@/features/claim-and-delegate/components/ClaimDelegateActionCard/ClaimDelegateActionCard'
import { ClaimDelegateCard } from '@/features/claim-and-delegate/components/ClaimDelegateCard/ClaimDelegateCard'
import {
  localSumrDelegates,
  mergeDelegatesData,
  type SumrDelegateWithDecayFactor,
} from '@/features/claim-and-delegate/consts'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import { useSumrDelegateTransaction } from '@/features/claim-and-delegate/hooks/use-sumr-delegate-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { ERROR_TOAST_CONFIG, SUCCESS_TOAST_CONFIG } from '@/features/toastify/config'
import { revalidateUser } from '@/helpers/revalidation-handlers'
import { useClientChainId } from '@/hooks/use-client-chain-id'
import { useUserWallet } from '@/hooks/use-user-wallet'

import {
  getChangeDelegateButtonLabel,
  getRemoveDelegateButtonLabel,
} from './getDelegateButtonLabel'
import { ClaimDelegateAction } from './types'

import classNames from './ClaimDelegateStep.module.css'

const getFilteredDelegates = (delegates: SumrDelegateWithDecayFactor[], searchValue: string) => {
  return delegates.filter((delegate) => {
    return (
      delegate.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      delegate.ens.toLowerCase().includes(searchValue.toLowerCase()) ||
      delegate.address.toLowerCase().includes(searchValue.toLowerCase())
    )
  })
}

const getIsCardFaded = ({ address, state }: { address: string; state: ClaimDelegateState }) => {
  return (
    state.delegatee !== ADDRESS_ZERO && state.delegatee?.toLowerCase() !== address.toLowerCase()
  )
}

interface ClaimDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

enum DelegateSortOptions {
  HIGHEST_VOTING_WEIGHT = 'highest-voting-weight',
  HIGHEST_VOTE_REWARD_POWER = 'highest-vote-reward-power',
}

const getDelegateSortOptions = (sortBy: DelegateSortOptions) => [
  {
    value: DelegateSortOptions.HIGHEST_VOTING_WEIGHT,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_VOTING_WEIGHT
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest $SUMR voting weight
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_VOTING_WEIGHT && (
          <Icon
            iconName="checkmark"
            size={14}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          />
        )}
      </div>
    ),
  },
  {
    value: DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color:
              sortBy === DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER
                ? 'var(--earn-protocol-primary-100)'
                : 'var(--earn-protocol-secondary-100)',
          }}
        >
          Highest Vote and Reward Power
        </Text>
        {sortBy === DelegateSortOptions.HIGHEST_VOTE_REWARD_POWER && (
          <Icon
            iconName="checkmark"
            size={14}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          />
        )}
      </div>
    ),
  },
]

export const ClaimDelegateStep: FC<ClaimDelegateStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const { walletAddress } = useParams()

  const [action, setAction] = useState<ClaimDelegateAction>()
  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()

  const [sortBy, setSortBy] = useState<DropdownRawOption>(
    getDelegateSortOptions(DelegateSortOptions.HIGHEST_VOTING_WEIGHT)[0],
  )

  const { decayFactor, isLoading: decayFactorLoading } = useDecayFactor(state.delegatee)

  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string

  const user = useUser()
  const { userWalletAddress } = useUserWallet()

  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const sumrToClaim =
    externalData.sumrToClaim.claimableAggregatedRewards.perChain[SDKChainId.BASE] ?? 0

  const apy = (
    <Text as="h5" variant="h5">
      up to{' '}
      {formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1))}{' '}
      <Text as="span" variant="p4semi">
        APR
      </Text>
    </Text>
  )
  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(sumrToClaim)) * Number(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1)))} $SUMR / Year`

  const { sumrDelegateTransaction } = useSumrDelegateTransaction({
    onSuccess: () => {
      dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.COMPLETED })

      toast.success('Delegate has been updated', SUCCESS_TOAST_CONFIG)

      if (action === ClaimDelegateAction.REMOVE) {
        dispatch({ type: 'update-delegatee', payload: ADDRESS_ZERO })
        dispatch({ type: 'update-step', payload: ClaimDelegateSteps.COMPLETED })

        return
      }

      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })
    },
    onError: () => {
      dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.FAILED })

      toast.error('Failed to update delegate', ERROR_TOAST_CONFIG)
    },
  })

  const hasStake = Number(externalData.sumrStakeDelegate.stakedAmount) > 0

  const isBase = clientChainId === SDKChainId.BASE

  const handleDelegate = async (updateDelegatee?: string) => {
    const isDelegateUnchanged =
      externalData.sumrStakeDelegate.delegatedTo.toLowerCase() === updateDelegatee?.toLowerCase() &&
      externalData.sumrStakeDelegate.delegatedTo !== ADDRESS_ZERO

    // delegation is only supported on base
    if (!isBase) {
      // eslint-disable-next-line no-console
      setChain({ chain: SDKChainIdToAAChainMap[SDKChainId.BASE] })

      return
    }

    if (isDelegateUnchanged) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })

      return
    }

    if (updateDelegatee !== ADDRESS_ZERO) {
      setAction(ClaimDelegateAction.CHANGE)
    } else {
      setAction(ClaimDelegateAction.REMOVE)

      if (hasStake) {
        return
      }
    }

    dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.PENDING })

    await sumrDelegateTransaction(updateDelegatee)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error delegating $SUMR:', err)
      })
      .finally(() => {
        revalidateUser(userWalletAddress)
      })
  }

  const mappedSumrDelegatesData = mergeDelegatesData(
    externalData.sumrDelegates,
    externalData.sumrDecayFactors,
  )

  const isChangeDelegateLoading =
    state.delegateStatus === ClaimDelegateTxStatuses.PENDING &&
    action === ClaimDelegateAction.CHANGE

  const isRemoveDelegateLoading =
    state.delegateStatus === ClaimDelegateTxStatuses.PENDING &&
    action === ClaimDelegateAction.REMOVE

  // self delegating is available on for EOA only
  // since we use tally that doesn't support SCA
  const isEoa = user?.type === AccountKitAccountType.EOA

  const sumrDelegatedTo =
    state.delegateStatus === ClaimDelegateTxStatuses.COMPLETED && state.delegatee
      ? state.delegatee.toLowerCase()
      : externalData.sumrStakeDelegate.delegatedTo.toLowerCase()

  const hasDelegatee = sumrDelegatedTo !== ADDRESS_ZERO

  const localDelegate = localSumrDelegates.find(
    (item) => item.address.toLowerCase() === sumrDelegatedTo,
  )

  const rewardsDataDelegatee = externalData.sumrDelegates.find(
    (item) => item.account.address.toLowerCase() === sumrDelegatedTo,
  )
  const value =
    sumrDelegatedTo === ADDRESS_ZERO
      ? 'No delegate'
      : rewardsDataDelegatee?.account.name && rewardsDataDelegatee.account.name !== ''
        ? rewardsDataDelegatee.account.name
        : localDelegate?.title ?? formatAddress(sumrDelegatedTo)

  const votes = mappedSumrDelegatesData.find(
    (item) => item.address.toLowerCase() === sumrDelegatedTo,
  )

  return (
    <div className={classNames.claimDelegateStepWrapper}>
      <div className={classNames.leftContent}>
        <Card className={classNames.cardWrapper}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Your delegate
          </Text>
          <div className={classNames.valueWithIcon}>
            <Text as="h4" variant="h4">
              {value}
            </Text>
          </div>
          {votes && (
            <Text
              as="div"
              variant="p3semi"
              style={{
                color: 'var(--earn-protocol-secondary-40)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--general-space-8)',
              }}
            >
              Total voting weight: <Icon tokenName="SUMR" size={16} />{' '}
              {formatCryptoBalance(votes.sumrAmount)}
            </Text>
          )}
        </Card>
        <div>
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
            Each delegate has their own values, intentions and visions for the Lazy Summer Protocol.
            Delegate your voting power to those who best align with your values.
          </Text>
          <Link href="https://forum.summer.fi/c/delegates/19" target="_blank">
            <WithArrow as="p" variant="p3">
              Learn more about Governance
            </WithArrow>
          </Link>
          <div className={classNames.spacer} />
        </div>
        <div>
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
            Earn $SUMR rewards for staking and delegating your tokens.
          </Text>
        </div>
        {isEoa && (
          <div className={classNames.selfDelegateCard}>
            <ClaimDelegateCard
              title="Delegate to yourself"
              description="Be your own Delegate. In order to accrue full staking rewards, you must vote on every proposal and remain active."
              ens=""
              address={resolvedWalletAddress}
              isActive={state.delegatee?.toLowerCase() === resolvedWalletAddress.toLowerCase()}
              handleClick={() =>
                dispatch({
                  type: 'update-delegatee',
                  payload: resolvedWalletAddress.toLowerCase(),
                })
              }
              selfDelegate
              disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
              isFaded={getIsCardFaded({ address: resolvedWalletAddress, state })}
            />
          </div>
        )}
      </div>
      <div className={classNames.rightContent}>
        <div className={classNames.rightContentHeading}>
          <div className={classNames.inputWrapper}>
            <Input
              variant="withBorder"
              placeholder="Find a delegate (Name, ENS or Address)"
              className={classNames.inputCustomStyles}
              icon={{
                name: 'search_icon',
                size: 20,
                style: { color: 'var(--earn-protocol-secondary-40)' },
              }}
              onChange={handleSearch}
              value={searchValue}
            />
          </div>
          <div>
            <Dropdown
              options={getDelegateSortOptions(sortBy.value as DelegateSortOptions)}
              dropdownValue={sortBy}
              dropdownOptionsStyle={{ left: 'unset', right: 0, top: '50px' }}
              dropdownChildrenStyle={{
                borderRadius: 'var(--general-radius-8)',
                padding: 'var(--general-space-12) var(--general-space-16)',
              }}
              asPill
              onChange={setSortBy}
            >
              <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                Sort by
              </Text>
            </Dropdown>
          </div>
        </div>
        {hasStake && action === ClaimDelegateAction.REMOVE ? (
          <ClaimDelegateActionCard
            title="Unable to remove delegate"
            description="You will need to unstake if you want to continue"
            actionLabel="Remove stake"
            action={() => {
              dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })
            }}
            closeAction={() => setAction(undefined)}
          />
        ) : (
          <div className={classNames.delegates}>
            {getFilteredDelegates(mappedSumrDelegatesData, searchValue)
              .sort((a, b) => {
                if (sortBy.value === DelegateSortOptions.HIGHEST_VOTING_WEIGHT) {
                  return b.sumrAmount - a.sumrAmount
                }

                return b.decayFactor - a.decayFactor
              })
              .map((delegate) => (
                <ClaimDelegateCard
                  key={delegate.address}
                  {...delegate}
                  isActive={state.delegatee === delegate.address}
                  handleClick={() =>
                    dispatch({ type: 'update-delegatee', payload: delegate.address })
                  }
                  votingPower={delegate.decayFactor}
                  disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                  isFaded={getIsCardFaded({ address: delegate.address, state })}
                />
              ))}
            {getFilteredDelegates(mappedSumrDelegatesData, searchValue).length === 0 && (
              <Text
                as="p"
                variant="p2semi"
                style={{
                  color: 'var(--earn-protocol-secondary-40)',
                  textAlign: 'center',
                  marginTop: 'var(--general-space-32)',
                }}
              >
                No delegates found
              </Text>
            )}
          </div>
        )}

        {hasStake && action === ClaimDelegateAction.REMOVE ? null : (
          <div className={classNames.buttonsWrapper}>
            <div className={classNames.buttonsGroup}>
              {hasDelegatee ? (
                !isBase ? null : (
                  <Button
                    variant="secondarySmall"
                    disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                    onClick={() => handleDelegate(ADDRESS_ZERO)}
                  >
                    <Text variant="p3semi" as="p">
                      {getRemoveDelegateButtonLabel({
                        state,
                        action,
                        isBase,
                      })}
                    </Text>
                  </Button>
                )
              ) : (
                <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
                  <Button
                    variant="secondarySmall"
                    disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                  >
                    <Text variant="p3semi" as="p">
                      Claim & Forfeit staking yield
                    </Text>
                  </Button>
                </Link>
              )}
              <Button
                variant="primarySmall"
                style={{ paddingRight: 'var(--general-space-32)' }}
                onClick={() => handleDelegate(state.delegatee)}
                disabled={
                  isBase &&
                  (isChangeDelegateLoading ||
                    isRemoveDelegateLoading ||
                    !state.delegatee ||
                    (state.delegatee === ADDRESS_ZERO &&
                      externalData.sumrStakeDelegate.delegatedTo === ADDRESS_ZERO) ||
                    userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase())
                }
              >
                <WithArrow
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                  variant="p3semi"
                  as="p"
                  isLoading={isChangeDelegateLoading}
                >
                  {getChangeDelegateButtonLabel({
                    state,
                    action,
                    isBase,
                  })}
                </WithArrow>
              </Button>
            </div>
            {hasDelegatee && (
              <Button
                disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                onClick={() => {
                  dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })
                }}
              >
                <WithArrow variant="p3semi" as="p">
                  Skip
                </WithArrow>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
