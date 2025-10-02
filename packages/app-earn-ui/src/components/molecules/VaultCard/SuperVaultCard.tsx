'use client'

import { type FC } from 'react'
import {
  type DeviceType,
  type IArmadaVaultInfo,
  type SDKVaultishType,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  slugifyVault,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { SuperBonusLabel } from '@/components/molecules/BonusLabel/SuperBonusLabel'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getUniqueVaultId } from '@/helpers/get-unique-vault-id'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'

import vaultCardStyles from './VaultCard.module.css'

type SuperVaultCardProps = SDKVaultishType & {
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
  deviceType?: DeviceType
  tooltipName?: string
  onTooltipOpen?: (tooltipName: string) => void
  merklRewards?: IArmadaVaultInfo['merklRewards'] | undefined
}

export const SuperVaultCard: FC<SuperVaultCardProps> = (props) => {
  const {
    id,
    protocol,
    inputToken,
    totalValueLockedUSD,
    withHover,
    inputTokenBalance,
    secondary = false,
    selected = false,
    onClick,
    customFields,
    merklRewards,
    withTokenBonus,
    sumrPrice,
    vaultApyData,
    wrapperStyle,
    disabled,
    depositCap,
    deviceType,
    onTooltipOpen,
    tooltipName,
  } = props

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus({
    merklRewards,
    sumrPrice,
    totalValueLockedUSD,
  })

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

  const combinedApr = formatDecimalAsPercent(Number(vaultApyData.apy) + Number(rawSumrTokenBonus))

  const _apyUpdatedAt = useApyUpdatedAt({
    vaultApyData,
  })

  const depositCapInToken = new BigNumber(depositCap.toString()).div(ten.pow(inputToken.decimals))

  const depositCapUsed = new BigNumber(inputTokenBalance.toString())
    .div(ten.pow(inputToken.decimals))
    .div(depositCapInToken)

  return (
    <GradientBox
      withHover={withHover && !disabled}
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
          <VaultTitle
            symbol={getDisplayToken(inputToken.symbol)}
            networkName={supportedSDKNetwork(protocol.network)}
            selected={selected}
            isVaultCard
          />
          <div className={vaultCardStyles.vaultBonusWrapper}>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              <SuperBonusLabel
                bonusContent="X OP + X UNI + 2.1% SUMR"
                tooltipContent={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Text
                      variant="p4semi"
                      style={{ color: 'var(--color-text-primary-hover)', display: 'flex', gap: 8 }}
                    >
                      <Icon iconName="sumr" size={16} />
                      SUMR Token Rewards
                    </Text>
                    <Text variant="p2semiColorful" style={{ marginBottom: '8px' }}>
                      {sumrTokenBonus}
                    </Text>
                    <Text
                      variant="p4semi"
                      style={{ color: 'var(--color-text-primary-hover)', display: 'flex', gap: 8 }}
                    >
                      <Icon iconName="op_circle" size={16} />
                      OP Token Rewards
                    </Text>
                    <Text variant="p2semi" style={{ marginBottom: '8px' }}>
                      xxxxxxxx
                    </Text>
                    <Text
                      variant="p4semi"
                      style={{ color: 'var(--color-text-primary-hover)', display: 'flex', gap: 8 }}
                    >
                      <Icon iconName="uni_circle_color" size={16} />
                      UNI Token Rewards
                    </Text>
                    <Text variant="p2semi" style={{ marginBottom: '8px' }}>
                      xxxxxxxx
                    </Text>
                  </div>
                }
                deviceType={deviceType}
                tooltipName={`${tooltipName}-${slugifyVault(props)}-bonus-label`}
                onTooltipOpen={onTooltipOpen}
              />
            </Text>
          </div>
        </div>
        <div className={vaultCardStyles.vaultCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              APY
            </Text>
            <div className={vaultCardStyles.totalAssetsDisplay}>
              <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                {parsedApr}
              </Text>
              <Text variant="p4semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
                {combinedApr}
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              Yield source chains
            </Text>
            <Text
              variant="p2semi"
              style={{
                color: 'var(--earn-protocol-secondary-100)',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon iconName="op_circle" size={18} />
              <Icon iconName="uni_circle_color" size={18} />
            </Text>
          </div>
        </div>
        <div className={vaultCardStyles.vaultCardAssetsWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              Total Assets
            </Text>
            <div className={vaultCardStyles.totalAssetsDisplay}>
              <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                {parsedTotalValueLocked}&nbsp;{getDisplayToken(inputToken.symbol)}
              </Text>
              <Text variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                ${parsedTotalValueLockedUSD}
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              Best For
            </Text>
            <Text
              variant="p2semi"
              style={{ color: 'var(--earn-protocol-secondary-100)', whiteSpace: 'nowrap' }}
            >
              {customFields?.bestFor ?? 'Optimized lending yield'}
            </Text>
          </div>
        </div>
        <div className={vaultCardStyles.depositCapSpacer} />
        <Text
          variant="p4semi"
          style={{
            margin: 0,
            color: 'var(--color-text-primary-hover)',
          }}
        >
          Deposit cap: {formatCryptoBalance(depositCapInToken)}&nbsp;{inputToken.symbol} (
          {formatDecimalAsPercent(depositCapUsed)} used)
        </Text>
      </Card>
    </GradientBox>
  )
}
