import { type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'

import strategyCardStyles from './StrategyCard.module.scss'

type StrategyCardProps = {
  symbol: TokenSymbolsList
  risk: Risk
  totalAssets: string
  bestFor: string
  tokenBonus?: string
  apy?: string
  onClick?: () => void
  secondary?: boolean
}

export const StrategyCard = ({
  symbol,
  risk,
  bestFor,
  tokenBonus,
  apy,
  totalAssets,
  onClick,
  secondary = false,
}: StrategyCardProps) => {
  return (
    <div className={clsx(strategyCardStyles.wrapper, strategyCardStyles.withOnClick)}>
      <Card
        className={strategyCardStyles.strategyCard}
        variant={secondary ? 'cardSecondary' : 'cardPrimary'}
        onClick={onClick}
      >
        <div className={strategyCardStyles.strategyCardHeaderWrapper}>
          <StrategyTitleWithRisk symbol={symbol} risk={risk} />
          <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            <BonusLabel tokenBonus={tokenBonus} apy={apy} />
          </Text>
        </div>
        <div className={strategyCardStyles.strategyCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>${totalAssets}</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Best for
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>{bestFor}</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}
