'use client'

import { type FC } from 'react'
import { type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
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
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'

import vaultCardStyles from './VaultCard.module.css'

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
  vaultApyData: VaultApyData
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
    rewardTokenEmissionsFinish,
    rewardTokens,
    withTokenBonus,
    sumrPrice,
    showCombinedBonus = false,
    vaultApyData,
    wrapperStyle,
    disabled,
    depositCap,
  } = props

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus(
    rewardTokens,
    rewardTokenEmissionsAmount,
    sumrPrice,
    totalValueLockedUSD,
    rewardTokenEmissionsFinish,
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

  const parsedApr = formatDecimalAsPercent(vaultApyData.apy)
  const parsedTotalValueLocked = formatCryptoBalance(
    new BigNumber(String(inputTokenBalance)).div(ten.pow(inputToken.decimals)),
  )
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(String(totalValueLockedUSD)))

  const combinedApr = showCombinedBonus
    ? formatDecimalAsPercent(Number(vaultApyData.apy) + Number(rawSumrTokenBonus))
    : undefined

  const apyUpdatedAt = useApyUpdatedAt({
    vaultApyData,
  })

  const depositCapInToken = new BigNumber(depositCap.toString()).div(ten.pow(inputToken.decimals))

  const depositCapUsed = new BigNumber(inputTokenBalance.toString())
    .div(ten.pow(inputToken.decimals))
    .div(depositCapInToken)

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
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              <BonusLabel
                tokenBonus={sumrTokenBonus}
                apy={parsedApr}
                withTokenBonus={Number(rawSumrTokenBonus) > 0 ? withTokenBonus : false}
                combinedApr={combinedApr}
                apyUpdatedAt={apyUpdatedAt}
              />
            </Text>
            <AdditionalBonusLabel externalTokenBonus={customFields?.bonus} />
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
            <Text
              variant="p4semi"
              style={{
                margin: 0,
                color: 'var(--color-text-primary-disabled)',
              }}
            >
              of {formatCryptoBalance(depositCapInToken)}&nbsp;{inputToken.symbol} cap (
              {formatDecimalAsPercent(depositCapUsed)} used)
            </Text>
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
