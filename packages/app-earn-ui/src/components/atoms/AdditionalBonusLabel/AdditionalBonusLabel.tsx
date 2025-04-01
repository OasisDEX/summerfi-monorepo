import { type ReactNode } from 'react'
import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import additionalBonusLabelStyles from './AdditionalBonusLabel.module.scss'

type AdditionalBonusLabelProps = {
  bonus?: EarnAppConfigType['fleetMap']['1']['0x']['bonus']
}

export const AdditionalBonusLabel = ({ bonus }: AdditionalBonusLabelProps): ReactNode | null => {
  return bonus ? (
    <Tooltip
      tooltipWrapperStyles={{
        marginTop: 'var(--general-space-12)',
      }}
      tooltip={
        <div className={additionalBonusLabelStyles.additionalBonusTooltipWrapper}>
          <div className={additionalBonusLabelStyles.additionalBonusTooltipTitle}>
            <Icon iconName={bonus.icon as IconNamesList} size={16} />
            <Text variant="p3semi" style={{ color: 'var(--color-text-primary-hover)' }}>
              {bonus.label}
            </Text>
          </div>
          <Text variant="p1semi" style={{ width: '270px', marginTop: 'var(--general-space-8)' }}>
            {bonus.description}
          </Text>
        </div>
      }
    >
      <div className={additionalBonusLabelStyles.additionalBonusLabelWrapper}>
        <Text variant="p2semi">{bonus.multiplier}x</Text>
        <Icon iconName={bonus.icon as IconNamesList} size={20} />
      </div>
    </Tooltip>
  ) : null
}
