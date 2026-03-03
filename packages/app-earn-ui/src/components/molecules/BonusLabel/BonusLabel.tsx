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
  totalSumrEarned?: string
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  deviceType?: DeviceType
  tooltipName?: string
  apy?: number
  managementFee?: number
  sumrTokenBonus?: number
  externalTokenBonus?: EarnAppFleetCustomConfigType['bonus']
  onTooltipOpen?: (tooltipName: string) => void
}

export const BonusLabelTooltip = ({
  apy,
  managementFee,
  sumrTokenBonus,
  externalTokenBonus,
  apyUpdatedAt,
  totalSumrEarned,
  liveApyParsed,
  netApyParsed,
  sumrTokenBonusParsed,
  managementFeeParsed,
}: {
  apy?: number
  managementFee?: number
  sumrTokenBonus?: number
  externalTokenBonus?: EarnAppFleetCustomConfigType['bonus']
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  totalSumrEarned?: string
  liveApyParsed: string
  netApyParsed: string
  sumrTokenBonusParsed?: string
  managementFeeParsed?: string
}): ReactNode => {
  const isAltPressed = useHoldAlt()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-x-small)' }}>
      {apy && (
        <LiveApyInfo
          apyCurrent={liveApyParsed}
          apyUpdatedAt={apyUpdatedAt}
          isAltPressed={isAltPressed}
        />
      )}
      {sumrTokenBonus && sumrTokenBonus > 0 && (
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
            $SUMR&nbsp;Token&nbsp;Rewards:
          </Text>
          <Icon iconName="stars_colorful" size={20} />
          <Text as="p" variant="p1semiColorful">
            {sumrTokenBonusParsed}
          </Text>
        </div>
      )}
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
      {sumrTokenBonus && totalSumrEarned && (
        <div>
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
            Total&nbsp;SUMR&nbsp;Earned&nbsp;to&nbsp;Date:
          </Text>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-space-x-small)',
              alignItems: 'center',
            }}
          >
            <Text as="p" variant="p1semi">
              {totalSumrEarned} $SUMR
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export const BonusLabel: FC<BonulsLabelProps> = ({
  apy,
  externalTokenBonus,
  sumrTokenBonus,
  managementFee,
  isLoading,
  apyUpdatedAt,
  totalSumrEarned,
  deviceType,
  onTooltipOpen,
  tooltipName,
}): React.ReactNode => {
  const grossApy = (apy ?? 0) + (sumrTokenBonus ?? 0)
  const netApy = grossApy - (managementFee ?? 0)

  const liveApyParsed = typeof apy === 'number' ? formatDecimalAsPercent(apy, { precision: 2 }) : ''
  const netApyParsed =
    typeof netApy === 'number' ? formatDecimalAsPercent(netApy, { precision: 2 }) : ''
  const sumrTokenBonusParsed =
    typeof sumrTokenBonus === 'number'
      ? formatDecimalAsPercent(sumrTokenBonus, { precision: 2 })
      : undefined
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
          sumrTokenBonus={sumrTokenBonus}
          externalTokenBonus={externalTokenBonus}
          apyUpdatedAt={apyUpdatedAt}
          totalSumrEarned={totalSumrEarned}
          liveApyParsed={liveApyParsed}
          netApyParsed={netApyParsed}
          sumrTokenBonusParsed={sumrTokenBonusParsed}
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
            {externalTokenBonus ?? (sumrTokenBonus && sumrTokenBonus > 0) ? (
              <Icon iconName="stars" size={24} color="white" />
            ) : null}
            <span style={{ fontWeight: 600 }}>{netApyParsed}&nbsp;APY</span>
          </Pill>
        ) : null}
      </Text>
    </Tooltip>
  )
}
