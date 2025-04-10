'use client'

import { type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { useHoldAlt } from '@/hooks/use-hold-alt'

import styles from './BonusLabel.module.scss'

export const BonusLabel = ({
  tokenBonus,
  apy,
  rays,
  raw,
  withTokenBonus = true,
  combinedApr,
  isLoading,
  apyUpdatedAt,
}: {
  isLoading?: boolean
  tokenBonus?: string
  apy?: string
  rays?: string
  raw?: ReactNode
  withTokenBonus?: boolean
  combinedApr?: string
  apyUpdatedAt?: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
}): React.ReactNode => {
  const isAltPressed = useHoldAlt()

  return (
    <Tooltip
      hideDrawerOnMobile
      tooltip={
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-x-small)' }}
        >
          {apy && (
            <LiveApyInfo apyCurrent={apy} apyUpdatedAt={apyUpdatedAt} isAltPressed={isAltPressed} />
          )}
          {tokenBonus && withTokenBonus && (
            <>
              <Text as="p" variant="p3semi">
                $SUMR Token Rewards:
              </Text>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-space-x-small)',
                  alignItems: 'center',
                }}
              >
                <Icon iconName="stars_colorful" size={20} />
                <Text as="p" variant="p1semiColorful">
                  {tokenBonus}
                </Text>
              </div>
            </>
          )}
        </div>
      }
      tooltipWrapperStyles={{
        minWidth: '240px',
        maxWidth: '500px',
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
        ) : !!tokenBonus || !!apy || !!rays || !!raw ? (
          <Pill>
            {tokenBonus ?? rays ? <Icon iconName="stars" size={24} color="white" /> : null}
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
                {rays ? `${rays} RAYS` : ''}
                {raw ? raw : ''}
              </span>
            )}
          </Pill>
        ) : null}
      </Text>
    </Tooltip>
  )
}
