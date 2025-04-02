import { type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import styles from './BonusLabel.module.scss'

export const BonusLabel = ({
  tokenBonus,
  apy,
  rays,
  raw,
  withTokenBonus = true,
  combinedApr,
  isLoading,
}: {
  isLoading?: boolean
  tokenBonus?: string
  apy?: string
  rays?: string
  raw?: ReactNode
  withTokenBonus?: boolean
  combinedApr?: string
}): React.ReactNode => {
  return (
    <Tooltip
      hideDrawerOnMobile
      tooltip={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {apy && (
            <Text as="p" variant="p4semi">
              Native Yield: {apy}
            </Text>
          )}
          {tokenBonus && withTokenBonus && (
            <Text as="p" variant="p4semi">
              $SUMR Rewards: {tokenBonus}
            </Text>
          )}
        </div>
      }
      tooltipWrapperStyles={{ minWidth: '240px', top: '30px', left: '0px' }}
      tooltipCardVariant="cardSecondarySmallPaddings"
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
