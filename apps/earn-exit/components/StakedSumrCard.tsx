'use client'

import { type FC } from 'react'
import { Button, Card, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { formatUnits } from 'viem'

import { type StakedSumrPosition, type SumrStake } from '@/lib/staking'

import classNames from './StakedSumrCard.module.css'

interface StakedSumrCardProps {
  position: StakedSumrPosition
  /** Undefined ⇒ read-only (viewing someone else's wallet): actions are disabled. */
  onUnstake?: (stake: SumrStake) => void
  onClaim?: () => void
}

const lockLabel = (stake: SumrStake): string => {
  if (!stake.isLocked) return 'Unlocked'

  const date = new Date(Number(stake.lockupEndTime) * 1000)

  return `Locked until ${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`
}

export const StakedSumrCard: FC<StakedSumrCardProps> = ({ position, onUnstake, onClaim }) => {
  const { sumrSymbol, sumrDecimals, chainId } = position
  const format = (amount: bigint, decimals = sumrDecimals) =>
    formatCryptoBalance(formatUnits(amount, decimals))

  return (
    <Card variant="cardSecondary" className={classNames.card}>
      <div className={classNames.header}>
        <div className={classNames.titleBlock}>
          <TokenWithNetworkIcon
            tokenName={sumrSymbol as TokenSymbolsList}
            chainId={chainId as SupportedNetworkIds}
            variant="medium"
          />
          <div>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              Staked {sumrSymbol}
            </Text>
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Governance staking · Base
            </Text>
          </div>
        </div>
        <div className={classNames.totalAmount}>
          <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            {format(position.totalStaked)} {sumrSymbol}
          </Text>
          <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {position.stakes.length} {position.stakes.length === 1 ? 'stake' : 'stakes'}
          </Text>
        </div>
      </div>

      {position.stakes.map((stake) => {
        const hasPenalty =
          stake.isLocked && position.penaltyEnabled && (stake.penaltyAmount ?? 0n) > 0n
        const received =
          stake.penaltyAmount !== null ? stake.amount - stake.penaltyAmount : stake.amount

        return (
          <div key={stake.index}>
            <hr className={classNames.divider} />
            <div className={classNames.stakeRow} style={{ paddingTop: 'var(--general-space-16)' }}>
              <div className={classNames.stakeInfo}>
                <Text
                  as="p"
                  variant="p2semi"
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                >
                  {format(stake.amount)} {sumrSymbol}
                </Text>
                <Text
                  as="p"
                  variant="p3"
                  style={{
                    color: stake.isLocked
                      ? 'var(--earn-protocol-warning-100)'
                      : 'var(--earn-protocol-success-100)',
                  }}
                >
                  {lockLabel(stake)}
                </Text>
                {hasPenalty ? (
                  <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-warning-100)' }}>
                    Unstaking now: {stake.penaltyPercentage?.toFixed(2)}% penalty (
                    {format(stake.penaltyAmount ?? 0n)} {sumrSymbol}) — you&apos;ll receive ≈{' '}
                    {format(received)} {sumrSymbol}
                  </Text>
                ) : null}
              </div>
              <Button
                variant="primarySmall"
                disabled={!onUnstake}
                onClick={() => onUnstake?.(stake)}
              >
                Unstake
              </Button>
            </div>
          </div>
        )
      })}

      {position.rewards.length > 0 ? (
        <>
          <hr className={classNames.divider} />
          <div className={classNames.rewards}>
            <div className={classNames.rewardsList}>
              <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                Claimable rewards
              </Text>
              {position.rewards.map((reward) => (
                <Text
                  key={reward.token}
                  as="p"
                  variant="p2semi"
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                >
                  {format(reward.earned, reward.decimals)} {reward.symbol}
                </Text>
              ))}
            </div>
            <Button variant="secondarySmall" disabled={!onClaim} onClick={() => onClaim?.()}>
              Claim
            </Button>
          </div>
        </>
      ) : null}
    </Card>
  )
}
