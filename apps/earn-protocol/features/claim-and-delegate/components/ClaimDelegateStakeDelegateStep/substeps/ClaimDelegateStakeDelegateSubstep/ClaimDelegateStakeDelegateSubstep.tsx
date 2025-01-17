import { type Dispatch, type FC } from 'react'
import {
  Button,
  Card,
  DataBlock,
  Icon,
  SkeletonLine,
  SUMR_CAP,
  Text,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { ClaimDelegateCard } from '@/features/claim-and-delegate/components/ClaimDelegateCard/ClaimDelegateCard'
import { mergeDelegatesData } from '@/features/claim-and-delegate/consts'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { type TokenBalanceData } from '@/hooks/use-token-balance'

import classNames from './ClaimDelegateStakeDelegateSubstep.module.scss'

interface ClaimDelegateStakeDelegateSubstepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  sumrBalanceData: TokenBalanceData
}

export const ClaimDelegateStakeDelegateSubstep: FC<ClaimDelegateStakeDelegateSubstepProps> = ({
  state,
  dispatch,
  externalData,
  sumrBalanceData,
}) => {
  const { walletAddress } = useParams()
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  // for now what user claimed will be basically user balance on base
  // until sumr token transferability will be enabled
  const claimed = formatCryptoBalance(sumrBalanceData.tokenBalance ?? '0')
  const claimedInUSD = formatFiatBalance(
    Number(sumrBalanceData.tokenBalance ?? '0') * estimatedSumrPrice,
  )

  const apy = formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy)
  const sumrPerYear = `*${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(externalData.sumrEarned)) * Number(externalData.sumrStakingInfo.sumrStakingApy))} $SUMR / Year`

  const handleStakeAndDelegate = () => {
    dispatch({ type: 'update-delegate-status', payload: ClaimDelegateTxStatuses.COMPLETED })
  }

  const hasNothingToStake = externalData.sumrBalances.base === '0'

  const mappedSumrDelegatesData = mergeDelegatesData(externalData.sumrDelegates)

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
          value={apy}
          valueStyle={{
            color: 'var(--earn-protocol-success-100)',
            marginBottom: 'var(--general-space-8)',
          }}
          valueSize="small"
          subValue={sumrPerYear}
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
        <div className={classNames.delegates}>
          {mappedSumrDelegatesData.map((delegate) => (
            <ClaimDelegateCard
              key={delegate.address}
              {...delegate}
              isActive={state.delegatee === delegate.address}
              handleClick={() => dispatch({ type: 'update-delegatee', payload: delegate.address })}
            />
          ))}
          {mappedSumrDelegatesData.length === 0 && (
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
            >
              {hasNothingToStake ? 'Delegate' : 'Stake & Delegate'}
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
