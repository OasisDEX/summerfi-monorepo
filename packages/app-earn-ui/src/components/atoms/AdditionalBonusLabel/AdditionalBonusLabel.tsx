import { type ReactNode } from 'react'
import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import additionalBonusLabelStyles from './AdditionalBonusLabel.module.css'

type AdditionalBonusLabelProps = {
  externalTokenBonus?: EarnAppConfigType['fleetMap']['1']['0x']['bonus']
  sumrTokenBonus?: string
}

/**
 * This is the `plain white` bonus label.
 */
export const AdditionalBonusLabel = ({
  externalTokenBonus,
  sumrTokenBonus,
}: AdditionalBonusLabelProps): ReactNode | null => {
  return externalTokenBonus ?? sumrTokenBonus ? (
    <Tooltip
      tooltipWrapperStyles={{
        marginTop: 'var(--general-space-12)',
      }}
      tooltip={
        externalTokenBonus ? (
          <div className={additionalBonusLabelStyles.additionalBonusTooltipWrapper}>
            <div className={additionalBonusLabelStyles.additionalBonusTooltipTitle}>
              <Icon iconName={externalTokenBonus.icon as IconNamesList} size={16} />
              <Text variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
                {externalTokenBonus.label}
              </Text>
            </div>
            <Text
              variant="p3"
              style={{
                width: '270px',
                marginTop: 'var(--general-space-8)',
                color: 'var(--earn-protocol-secondary-60)',
              }}
            >
              {externalTokenBonus.description}
            </Text>
          </div>
        ) : undefined
      }
    >
      <div className={additionalBonusLabelStyles.additionalBonusLabelWrapper}>
        {sumrTokenBonus && (
          <div>
            <Icon iconName="stars" size={23} />
            <Text variant="p2semi">{sumrTokenBonus} SUMR</Text>
          </div>
        )}
        {externalTokenBonus && (
          <div>
            <Text variant="p2semi">{externalTokenBonus.multiplier}x</Text>
            <Icon iconName={externalTokenBonus.icon as IconNamesList} size={20} />
          </div>
        )}
      </div>
    </Tooltip>
  ) : null
}
