'use client'

import { type FC, type ReactNode } from 'react'
import {
  type DeviceType,
  type EarnAppFleetCustomConfigType,
  type IconNamesList,
} from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { useHoldAlt } from '@/hooks/use-hold-alt'

interface BonulsLabelProps {
  isLoading?: boolean
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  deviceType?: DeviceType
  tooltipName?: string
  apy?: number
  managementFee?: number
  totalAnnualRewardsPerToken?: { [tokenSymbol: string]: number }
  externalTokenBonus?: EarnAppFleetCustomConfigType['bonus']
  onTooltipOpen?: (tooltipName: string) => void
}

export const BonusLabelTooltip = ({
  apy,
  managementFee,
  externalTokenBonus,
  totalAnnualRewardsPerToken,
  apyUpdatedAt,
  liveApyParsed,
  netApyParsed,
  managementFeeParsed,
}: {
  apy?: number
  managementFee?: number
  rewardsTokenBonus?: number
  externalTokenBonus?: EarnAppFleetCustomConfigType['bonus']
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  totalAnnualRewardsPerToken?: { [tokenSymbol: string]: number }
  liveApyParsed: string
  netApyParsed: string
  managementFeeParsed?: string
}): ReactNode => {
  const isAltPressed = useHoldAlt()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-x-small)' }}>
      {!!apy && (
        <LiveApyInfo
          apyCurrent={liveApyParsed}
          apyUpdatedAt={apyUpdatedAt}
          isAltPressed={isAltPressed}
        />
      )}
      {totalAnnualRewardsPerToken &&
        Object.keys(totalAnnualRewardsPerToken).length > 0 &&
        Object.keys(totalAnnualRewardsPerToken).map((tokenSymbol) => (
          <div
            key={tokenSymbol}
            style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}
          >
            <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
              {tokenSymbol === 'SUMR' ? `$SUMR` : tokenSymbol}&nbsp;Token&nbsp;Rewards:
            </Text>
            <Icon
              iconName={tokenSymbol === 'SUMR' ? 'stars_colorful' : 'stars'}
              size={20}
              color={
                {
                  WSTETH: '#00a4ff',
                }[tokenSymbol.toUpperCase()]
              }
            />
            <Text
              as="p"
              variant="p1semiColorful"
              style={{
                backgroundImage: {
                  WSTETH: 'linear-gradient(90deg, #00a4ff 0%, #89d4ff 100%)',
                }[tokenSymbol.toUpperCase()],
              }}
            >
              {formatDecimalAsPercent(totalAnnualRewardsPerToken[tokenSymbol], { precision: 2 })}
            </Text>
          </div>
        ))}
      {managementFee && (
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
            Management&nbsp;Fee:
          </Text>
          <Text as="p" variant="p1semi">
            -{managementFeeParsed}
          </Text>
        </div>
      )}
      {externalTokenBonus && (
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          {externalTokenBonus.multiplier > 0 && (
            <Text as="p" variant="p2semi">
              {externalTokenBonus.multiplier}x
            </Text>
          )}
          <Text as="p" variant="p1semi" style={{ color: 'var(--color-text-primary)' }}>
            {externalTokenBonus.label}
          </Text>
          <Icon iconName={externalTokenBonus.icon as IconNamesList} size={20} />
        </div>
      )}
      {!Number.isNaN(netApyParsed) && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-space-x-small)',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 'var(--spacing-space-small)',
          }}
        >
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
            Net&nbsp;APY:
          </Text>
          <Text as="p" variant="p1semi">
            {netApyParsed}
          </Text>
        </div>
      )}
    </div>
  )
}

export const BonusLabel: FC<BonulsLabelProps> = ({
  apy,
  externalTokenBonus,
  totalAnnualRewardsPerToken,
  managementFee,
  isLoading,
  apyUpdatedAt,
  deviceType,
  onTooltipOpen,
  tooltipName,
}): React.ReactNode => {
  const grossRewardsTokenBonus = totalAnnualRewardsPerToken
    ? Object.values(totalAnnualRewardsPerToken).reduce((acc, bonus) => acc + bonus, 0)
    : 0
  const grossApy = (apy ?? 0) + grossRewardsTokenBonus
  const netApy = grossApy - (managementFee ?? 0)

  const liveApyParsed = typeof apy === 'number' ? formatDecimalAsPercent(apy, { precision: 2 }) : ''
  const netApyParsed =
    typeof netApy === 'number' ? formatDecimalAsPercent(netApy, { precision: 2 }) : ''

  const managementFeeParsed =
    typeof managementFee === 'number'
      ? formatDecimalAsPercent(managementFee, { precision: 2 })
      : undefined

  return (
    <Tooltip
      deviceType={deviceType}
      stopPropagation
      tooltipName={tooltipName}
      onTooltipOpen={onTooltipOpen}
      tooltip={
        <BonusLabelTooltip
          apy={apy}
          managementFee={managementFee}
          totalAnnualRewardsPerToken={totalAnnualRewardsPerToken}
          externalTokenBonus={externalTokenBonus}
          apyUpdatedAt={apyUpdatedAt}
          liveApyParsed={liveApyParsed}
          netApyParsed={netApyParsed}
          managementFeeParsed={managementFeeParsed}
        />
      }
      tooltipWrapperStyles={{
        minWidth: '220px',
        maxWidth: '400px',
        top: '30px',
        left: '0px',
      }}
      tooltipCardVariant="cardSecondary"
    >
      <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
        {isLoading ? (
          <Pill>
            <Icon iconName="stars" size={24} color="white" />
            <SkeletonLine height={20} width={90} style={{ opacity: 0.5 }} />
          </Pill>
        ) : apy ? (
          <Pill>
            {(externalTokenBonus ?? (grossRewardsTokenBonus && grossRewardsTokenBonus > 0)) ? (
              <Icon iconName="stars" size={24} color="white" />
            ) : null}
            <span style={{ fontWeight: 600 }}>{netApyParsed}&nbsp;APY</span>
          </Pill>
        ) : null}
      </Text>
    </Tooltip>
  )
}
