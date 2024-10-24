import { type SDKVaultishType } from '@summerfi/app-types'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'

import strategyCardStyles from './StrategyCard.module.scss'

type StrategyCardProps = SDKVaultishType & {
  onClick?: (id: string) => void
  secondary?: boolean
  selected?: boolean
  withHover?: boolean
  staggerIndex?: number
}

export const StrategyCard = ({
  id,
  protocol,
  inputToken,
  totalValueLockedUSD,
  withHover,
  secondary = false,
  selected = false,
  onClick,
}: StrategyCardProps) => {
  const handleStrategyClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  return (
    <div
      className={clsx(strategyCardStyles.wrapper, {
        [strategyCardStyles.withHover]: !selected && withHover,
        [strategyCardStyles.selected]: selected,
      })}
      onClick={handleStrategyClick}
    >
      <Card
        className={strategyCardStyles.strategyCard}
        variant={secondary ? 'cardSecondary' : 'cardPrimary'}
      >
        <div className={strategyCardStyles.strategyCardHeaderWrapper}>
          <StrategyTitleWithRisk
            symbol={inputToken.symbol}
            risk="low"
            networkName={protocol.network}
          />
          <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            <BonusLabel tokenBonus="some" apy="thing" />
          </Text>
        </div>
        <div className={strategyCardStyles.strategyCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              ${totalValueLockedUSD}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Best for
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>bestFor</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}
