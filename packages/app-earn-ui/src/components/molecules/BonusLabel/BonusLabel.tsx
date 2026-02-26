'use client'

import { type FC, type ReactNode } from 'react'
import { type DeviceType } from '@summerfi/app-types'
import { formatPercent } from '@summerfi/app-utils'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { useHoldAlt } from '@/hooks/use-hold-alt'

import styles from './BonusLabel.module.css'

interface BonulsLabelProps {
  isLoading?: boolean
  tokenBonus?: string
  apy?: string
  raw?: ReactNode
  withTokenBonus?: boolean
  combinedApr?: string
  totalSumrEarned?: string
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  deviceType?: DeviceType
  tooltipName?: string
  managementFee?: string
  onTooltipOpen?: (tooltipName: string) => void
}

export const BonusLabel: FC<BonulsLabelProps> = ({
  tokenBonus,
  apy,
  raw,
  withTokenBonus = true,
  combinedApr,
  managementFee,
  isLoading,
  apyUpdatedAt,
  totalSumrEarned,
  deviceType,
  onTooltipOpen,
  tooltipName,
}): React.ReactNode => {
  const isAltPressed = useHoldAlt()

  const netApy =
    Number(combinedApr?.replace('%', '')) -
    (managementFee ? Number(managementFee.replace('%', '')) : 0)

  return (
    <Tooltip
      deviceType={deviceType}
      stopPropagation
      tooltipName={tooltipName}
      onTooltipOpen={onTooltipOpen}
      tooltip={
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-small)' }}
        >
          {apy && (
            <LiveApyInfo apyCurrent={apy} apyUpdatedAt={apyUpdatedAt} isAltPressed={isAltPressed} />
          )}
          {tokenBonus && withTokenBonus && (
            <div
              style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}
            >
              <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
                $SUMR Token Rewards:
              </Text>
              <Icon iconName="stars_colorful" size={20} />
              <Text as="p" variant="p1semiColorful">
                {tokenBonus}
              </Text>
            </div>
          )}
          {managementFee && (
            <div
              style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}
            >
              <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
                Management Fee:
              </Text>
              <Text as="p" variant="p1semi">
                -{managementFee}
              </Text>
            </div>
          )}
          {!Number.isNaN(netApy) && (
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
                Net APY:
              </Text>
              <Text as="p" variant="p1semi">
                {formatPercent(netApy, {
                  precision: 2,
                })}
              </Text>
            </div>
          )}
          {tokenBonus && withTokenBonus && totalSumrEarned && (
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
        ) : !!tokenBonus || !!apy || !!raw ? (
          <Pill>
            {tokenBonus ? <Icon iconName="stars" size={24} color="white" /> : null}
            {combinedApr ? (
              <Text variant="p3semi" as="span">
                {combinedApr} APY
              </Text>
            ) : (
              <span style={{ fontWeight: 600 }}>
                {apy ? (
                  <>
                    <span className={styles.apyLabel}>APY</span> {apy}
                  </>
                ) : (
                  ''
                )}
                {tokenBonus && withTokenBonus && apy ? <>&nbsp;+&nbsp;</> : ''}
                {tokenBonus && withTokenBonus ? <>{tokenBonus}&nbsp;SUMR</> : ''}
                {raw ? raw : ''}
              </span>
            )}
          </Pill>
        ) : null}
      </Text>
    </Tooltip>
  )
}
