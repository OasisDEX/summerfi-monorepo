import { type ChangeEvent, type Dispatch, type FC, useState } from 'react'
import {
  Button,
  Card,
  DataBlock,
  Icon,
  Input,
  SkeletonLine,
  SUMR_CAP,
  Text,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { ClaimDelegateCard } from '@/features/claim-and-delegate/components/ClaimDelegateCard/ClaimDelegateCard'
import { mergeDelegatesData, type SumrDelegate } from '@/features/claim-and-delegate/consts'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { type TokenBalanceData } from '@/hooks/use-token-balance'

import classNames from './ClaimDelegateStakeDelegateSubstep.module.scss'

const getFilteredDelegates = (delegates: SumrDelegate[], searchValue: string) => {
  return delegates.filter((delegate) => {
    return (
      delegate.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      delegate.ens.toLowerCase().includes(searchValue.toLowerCase()) ||
      delegate.address.toLowerCase().includes(searchValue.toLowerCase())
    )
  })
}

interface ClaimDelegateStakeDelegateSubstepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  sumrBalanceData: TokenBalanceData
  decayFactor: number | undefined
  decayFactorLoading: boolean
}

export const ClaimDelegateStakeDelegateSubstep: FC<ClaimDelegateStakeDelegateSubstepProps> = ({
  state,
  dispatch,
  externalData,
  sumrBalanceData,
  // fallback to 1 to avoid UI flickering when
  // decay factor is loading
  decayFactor = 1,
  decayFactorLoading,
}) => {
  const { walletAddress } = useParams()
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()

  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  // for now what user claimed will be basically user balance on base
  // until sumr token transferability will be enabled
  const claimed = formatCryptoBalance(sumrBalanceData.tokenBalance ?? '0')
  const claimedInUSD = formatFiatBalance(
    Number(sumrBalanceData.tokenBalance ?? '0') * estimatedSumrPrice,
  )
  const sumrToClaim = externalData.sumrToClaim.perChain[SDKChainId.BASE] ?? 0

  const apy = (
    <Text as="h5" variant="h5">
      up to {formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy * decayFactor)}{' '}
      <Text as="span" variant="p4semi">
        APY
      </Text>
    </Text>
  )
  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(sumrToClaim)) * Number(externalData.sumrStakingInfo.sumrStakingApy * decayFactor))} $SUMR / Year`

  const hasNothingToStake = externalData.sumrBalances.base === '0'

  const handleStakeAndDelegate = () => {
    if (state.stakingStatus === ClaimDelegateTxStatuses.COMPLETED || hasNothingToStake) {
      // delegate tx here
      // eslint-disable-next-line no-console
      console.log('delegate tx here')
      dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.COMPLETED })
    } else {
      // stake tx here
      // eslint-disable-next-line no-console
      console.log('stake tx here')
      dispatch({ type: 'update-staking-status', payload: ClaimDelegateTxStatuses.COMPLETED })
    }
  }

  const mappedSumrDelegatesData = mergeDelegatesData(externalData.sumrDelegates)

  const isLoading =
    state.stakingStatus === ClaimDelegateTxStatuses.PENDING ||
    state.delegateStatus === ClaimDelegateTxStatuses.PENDING

  return (
    <div className={classNames.claimDelegateStakeDelegateSubstepWrapper}>
      <div className={classNames.leftContent}>
        <Card className={classNames.cardWrapper}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            You have claimed
          </Text>
          <div className={classNames.valueWithIcon}>
            <Icon tokenName="SUMR" />
            <Text as="h4" variant="h4">
              {sumrBalanceData.tokenBalanceLoading ? (
                <SkeletonLine
                  height="16px"
                  width="70px"
                  style={{
                    marginTop: 'var(--general-space-12)',
                    marginBottom: 'var(--general-space-12)',
                  }}
                />
              ) : (
                claimed
              )}
            </Text>
          </div>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {sumrBalanceData.tokenBalanceLoading ? (
              <SkeletonLine
                height="12px"
                width="40px"
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              />
            ) : (
              `$${claimedInUSD}`
            )}
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
        <div className={classNames.selfDelegateCard}>
          <ClaimDelegateCard
            title="Delegate to yourself"
            description="Be your own Delegate. In order to accrue full staking rewards, you must vote on every proposal and remain active."
            ens=""
            address={walletAddress as string}
            isActive={state.delegatee === (walletAddress as string).toLowerCase()}
            handleClick={() =>
              dispatch({
                type: 'update-delegatee',
                payload: (walletAddress as string).toLowerCase(),
              })
            }
            selfDelegate
          />
        </div>
      </div>
      <div className={classNames.rightContent}>
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
        <div className={classNames.delegates}>
          {getFilteredDelegates(mappedSumrDelegatesData, searchValue).map((delegate) => (
            <ClaimDelegateCard
              key={delegate.address}
              {...delegate}
              isActive={state.delegatee === delegate.address}
              handleClick={() => dispatch({ type: 'update-delegatee', payload: delegate.address })}
              votingPower={
                externalData.sumrDecayFactors.find((factor) => factor.address === delegate.address)
                  ?.decayFactor ?? 1
              }
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
        <div className={classNames.buttonsWrapper}>
          <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
            <Button variant="secondarySmall">
              <Text variant="p3semi" as="p">
                Claim & Forfeit staking yield
              </Text>
            </Button>
          </Link>
          <Button
            variant="primarySmall"
            style={{ paddingRight: 'var(--general-space-32)' }}
            onClick={handleStakeAndDelegate}
            disabled={
              !state.delegatee || state.delegatee === externalData.sumrStakeDelegate.delegatedTo
            }
          >
            <WithArrow
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
              variant="p3semi"
              as="p"
              isLoading={isLoading}
            >
              {hasNothingToStake || state.stakingStatus === ClaimDelegateTxStatuses.COMPLETED
                ? 'Delegate'
                : 'Stake'}
              {state.stakingStatus === ClaimDelegateTxStatuses.PENDING && 'Staking...'}
              {state.delegateStatus === ClaimDelegateTxStatuses.PENDING && 'Delegating...'}
              {[state.delegateStatus, state.stakingStatus].includes(
                ClaimDelegateTxStatuses.FAILED,
              ) && 'Retry'}
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
