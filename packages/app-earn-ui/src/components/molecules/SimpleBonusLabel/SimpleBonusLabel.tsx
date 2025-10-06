'use client'

import { type FC, type ReactNode } from 'react'
import { type DeviceType } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface SimpleBonusLabelProps {
  isLoading?: boolean
  deviceType?: DeviceType
  tooltipName?: string
  bonusLabel: ReactNode
  tooltip: ReactNode
  onTooltipOpen?: (tooltipName: string) => void
}

// a simplfied version of the BonusLabel for custom content
export const SimpleBonusLabel: FC<SimpleBonusLabelProps> = ({
  isLoading,
  deviceType,
  tooltipName,
  bonusLabel,
  tooltip,
  onTooltipOpen,
}): React.ReactNode => {
  return (
    <Tooltip
      deviceType={deviceType}
      stopPropagation
      tooltipName={tooltipName}
      onTooltipOpen={onTooltipOpen}
      tooltip={tooltip}
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
        ) : (
          <Pill>
            <Icon iconName="stars" size={24} color="white" />
            <Text variant="p3semi" as="span">
              {bonusLabel}
            </Text>
          </Pill>
        )}
      </Text>
    </Tooltip>
  )
}
