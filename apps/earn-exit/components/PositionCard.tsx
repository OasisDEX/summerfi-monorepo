'use client'

import { type FC } from 'react'
import { Button, Card, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import { formatUnits } from 'viem'

import { type FleetPosition } from '@/lib/positions'

import classNames from './PositionCard.module.css'

interface PositionCardProps {
  position: FleetPosition
  usdValue: number | null
  onExit?: (position: FleetPosition) => void
}

export const PositionCard: FC<PositionCardProps> = ({ position, usdValue, onExit }) => {
  const amount = formatUnits(position.totalAssets, position.asset.decimals)

  return (
    <Card variant="cardSecondary" className={classNames.positionCard}>
      <div className={classNames.titleBlock}>
        <TokenWithNetworkIcon
          tokenName={position.asset.symbol as TokenSymbolsList}
          chainId={position.chainId as SupportedNetworkIds}
          variant="medium"
        />
        <div className={classNames.titleText}>
          <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            {position.displayName || position.fleetName}
          </Text>
          {position.stakedShares > 0n ? (
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Includes staked shares
            </Text>
          ) : null}
        </div>
      </div>

      <div className={classNames.valueBlock}>
        <div className={classNames.amounts}>
          <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            {formatCryptoBalance(amount)} {position.asset.symbol}
          </Text>
          {usdValue !== null ? (
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              ≈ ${formatFiatBalance(usdValue)}
            </Text>
          ) : null}
        </div>
        <Button variant="primarySmall" disabled={!onExit} onClick={() => onExit?.(position)}>
          Exit
        </Button>
      </div>
    </Card>
  )
}
