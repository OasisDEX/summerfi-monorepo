'use client'

import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
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
  withSumr: boolean
}

export const VaultCard = ({
  id,
  protocol,
  inputToken,
  totalValueLockedUSD,
  withHover,
  secondary = false,
  selected = false,
  onClick,
  calculatedApr,
  customFields,
  withSumr,
}: VaultCardProps) => {
  const handleVaultClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  const parsedApr = formatDecimalAsPercent(new BigNumber(calculatedApr).div(100))
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(totalValueLockedUSD))

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
            <BonusLabel tokenBonus="some" apy={parsedApr} withSumr={withSumr} />
          </Text>
        </div>
        <div className={vaultCardStyles.vaultCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
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
