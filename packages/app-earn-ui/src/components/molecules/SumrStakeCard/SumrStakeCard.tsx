import { type FC } from 'react'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'
import { SimpleBonusLabel } from '@/components/molecules/SimpleBonusLabel/SimpleBonusLabel'

import classNames from './SumrStakeCard.module.css'

interface SumrStakeCardProps {
  apy: number
  tooltipName: string
  availableToStake: number
  availableToStakeUSD: number
  yieldToken: string
  yieldTokenApy: string
  onTooltipOpen?: (tooltipName: string) => void
  handleClick?: () => void
}

export const SumrStakeCard: FC<SumrStakeCardProps> = ({
  apy,
  tooltipName,
  availableToStake,
  availableToStakeUSD,
  yieldToken,
  yieldTokenApy,
  onTooltipOpen,
  handleClick,
}) => {
  return (
    <GradientBox selected onClick={handleClick}>
      <Card variant="cardGradientLight" className={classNames.sumrStakeCard}>
        <div className={classNames.sumrStakeCardHeaderWrapper}>
          <Text variant="h4" as="h4" className={classNames.titleIconWrapper}>
            <Icon tokenName="SUMR" size={36} />
            SUMR
          </Text>
          <SimpleBonusLabel
            bonusLabel={`SUMR Reward APY up to ${formatDecimalAsPercent(apy)}`}
            tooltipName={tooltipName}
            onTooltipOpen={onTooltipOpen}
            tooltip={
              <div>
                <Text variant="p3semi" as="p">
                  SUMR Reward APY up to {formatDecimalAsPercent(apy)}
                </Text>
              </div>
            }
          />
        </div>
        <div className={classNames.sumrStakeCardDataWrapper}>
          <div className={classNames.sumrStakeCardDataItem}>
            <Text variant="p3semi" as="p" className={classNames.sumrStakeCardDataTitle}>
              Available to stake
            </Text>
            <Text variant="p1semi" as="p" className={classNames.sumrStakeCardDataValue}>
              {formatCryptoBalance(availableToStake)} SUMR
            </Text>
            <Text variant="p4semi" as="p" className={classNames.sumrStakeCardDataSubValue}>
              ${formatFiatBalance(availableToStakeUSD)}
            </Text>
          </div>
          <div className={classNames.sumrStakeCardDataItem}>
            <Text variant="p3semi" as="p" className={classNames.sumrStakeCardDataTitle}>
              {yieldToken} Yield
            </Text>
            <Text variant="p1semi" as="p" className={classNames.sumrStakeCardDataValue}>
              {yieldTokenApy ? `Up to ${formatDecimalAsPercent(yieldTokenApy)}` : '-'}
            </Text>
          </div>
        </div>
      </Card>
    </GradientBox>
  )
}
