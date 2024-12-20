'use client'

import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'

import vaultCardStyles from './VaultCard.module.scss'

type VaultCardProps = SDKVaultishType & {
  onClick?: (id: string) => void
  secondary?: boolean
  selected?: boolean
  withHover?: boolean
  staggerIndex?: number
  withTokenBonus?: boolean
  sumrDilutedValuation?: string
  sumrPrice?: number
}

export const VaultCard = ({
  id,
  protocol,
  inputToken,
  totalValueLockedUSD,
  inputTokenBalance,
  withHover,
  secondary = false,
  selected = false,
  onClick,
  calculatedApr,
  customFields,
  rewardTokenEmissionsAmount,
  rewardTokens,
  withTokenBonus,
  sumrPrice,
}: VaultCardProps) => {
  const sumrIndex = rewardTokens.findIndex((item) => item.token.symbol === 'SUMMER')

  // calculate sumr daily bonus
  const bonusSumrDaily = rewardTokenEmissionsAmount[sumrIndex]
    ? // eslint-disable-next-line no-mixed-operators
      Number(rewardTokenEmissionsAmount[sumrIndex]) / 10 ** 18
    : 0

  const tokenBonus = formatDecimalAsPercent(
    sumrPrice && Number(totalValueLockedUSD)
      ? ((bonusSumrDaily * 365 * sumrPrice) / Number(totalValueLockedUSD)).toString()
      : '0',
  )

  const handleVaultClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  const parsedApr = formatDecimalAsPercent(new BigNumber(calculatedApr).div(100))
  const parsedTotalValueLocked = formatCryptoBalance(
    new BigNumber(String(inputTokenBalance)).div(ten.pow(inputToken.decimals)),
  )
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(String(totalValueLockedUSD)))

  return (
    <GradientBox withHover={withHover} selected={selected} onClick={handleVaultClick}>
      <Card
        className={clsx(vaultCardStyles.vaultCard, {
          [vaultCardStyles.vaultCardSelected]: selected,
        })}
        variant={secondary ? 'cardSecondary' : 'cardPrimary'}
      >
        <div className={vaultCardStyles.vaultCardHeaderWrapper}>
          <VaultTitleWithRisk
            symbol={inputToken.symbol}
            risk={customFields?.risk ?? 'medium'}
            networkName={protocol.network}
            selected={selected}
          />
          <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            <BonusLabel tokenBonus={tokenBonus} apy={parsedApr} withTokenBonus={withTokenBonus} />
          </Text>
        </div>
        <div className={vaultCardStyles.vaultCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              {parsedTotalValueLocked}&nbsp;{inputToken.symbol}
            </Text>
            <Text variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              ${parsedTotalValueLockedUSD}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Best for
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              {customFields?.bestFor ?? '-'}
            </Text>
          </div>
        </div>
      </Card>
    </GradientBox>
  )
}
