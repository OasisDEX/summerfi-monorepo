'use client'

import { type FC } from 'react'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import { AdditionalBonusLabel } from '@/components/atoms/AdditionalBonusLabel/AdditionalBonusLabel'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getUniqueVaultId } from '@/helpers/get-unique-vault-id'

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
  showCombinedBonus?: boolean
  apy: number
  wrapperStyle?: React.CSSProperties
  disabled?: boolean
}

export const VaultCard: FC<VaultCardProps> = (props) => {
  const {
    id,
    protocol,
    inputToken,
    totalValueLockedUSD,
    inputTokenBalance,
    withHover,
    secondary = false,
    selected = false,
    onClick,
    customFields,
    rewardTokenEmissionsAmount,
    rewardTokens,
    withTokenBonus,
    sumrPrice,
    showCombinedBonus = false,
    apy,
    wrapperStyle,
    disabled,
  } = props

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus(
    rewardTokens,
    rewardTokenEmissionsAmount,
    sumrPrice,
    totalValueLockedUSD,
  )

  const handleVaultClick = () => {
    if (onClick && !disabled) {
      onClick(
        getUniqueVaultId({
          id,
          protocol,
        } as SDKVaultishType),
      )
    }
  }

  const parsedApr = formatDecimalAsPercent(apy)
  const parsedTotalValueLocked = formatCryptoBalance(
    new BigNumber(String(inputTokenBalance)).div(ten.pow(inputToken.decimals)),
  )
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(String(totalValueLockedUSD)))

  const combinedApr = showCombinedBonus
    ? formatDecimalAsPercent(Number(apy) + Number(rawSumrTokenBonus))
    : undefined

  return (
    <GradientBox
      withHover={withHover}
      selected={selected}
      onClick={handleVaultClick}
      style={wrapperStyle}
    >
      <Card
        className={clsx(vaultCardStyles.vaultCard, {
          [vaultCardStyles.vaultCardSelected]: selected,
        })}
        variant={secondary ? 'cardSecondary' : 'cardPrimary'}
        disabled={disabled}
      >
        <div className={vaultCardStyles.vaultCardHeaderWrapper}>
          <VaultTitleWithRisk
            symbol={getDisplayToken(inputToken.symbol)}
            risk={customFields?.risk ?? 'lower'}
            networkName={protocol.network}
            selected={selected}
            isVaultCard
          />
          <div className={vaultCardStyles.vaultBonusWrapper}>
            {Number(rawSumrTokenBonus) > 0 && (
              <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                <BonusLabel
                  tokenBonus={sumrTokenBonus}
                  apy={parsedApr}
                  withTokenBonus={withTokenBonus}
                  combinedApr={combinedApr}
                />
              </Text>
            )}
            <AdditionalBonusLabel bonus={customFields?.bonus} />
          </div>
        </div>
        <div className={vaultCardStyles.vaultCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Total assets
            </Text>
            <div className={vaultCardStyles.totalAssetsDisplay}>
              <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                {parsedTotalValueLocked}&nbsp;{getDisplayToken(inputToken.symbol)}
              </Text>
              <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                (${parsedTotalValueLockedUSD})
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Best for
            </Text>
            <Text
              variant="p1semi"
              style={{ color: 'var(--earn-protocol-secondary-100)', whiteSpace: 'nowrap' }}
            >
              {customFields?.bestFor ?? 'Optimized lending yield'}
            </Text>
          </div>
        </div>
      </Card>
    </GradientBox>
  )
}
