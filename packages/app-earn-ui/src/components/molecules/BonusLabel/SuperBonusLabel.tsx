'use client'

import { type FC, type ReactNode } from 'react'
import { type DeviceType } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface SuperBonusLabelProps {
  isLoading?: boolean
  bonusContent?: ReactNode
  tooltipContent?: ReactNode
  deviceType?: DeviceType
  tooltipName?: string
  onTooltipOpen?: (tooltipName: string) => void
}

export const SuperBonusLabel: FC<SuperBonusLabelProps> = ({
  bonusContent,
  tooltipContent,
  isLoading,
  deviceType,
  onTooltipOpen,
  tooltipName,
}): React.ReactNode => {
  return (
    <Tooltip
      deviceType={deviceType}
      stopPropagation
      tooltipName={tooltipName}
      onTooltipOpen={onTooltipOpen}
      tooltip={
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          {tooltipContent}
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
          <Pill isSuper>
            <Icon iconName="stars" size={24} color="#EC8E34" />
            <SkeletonLine height={20} width={90} style={{ opacity: 0.5 }} />
          </Pill>
        ) : bonusContent ? (
          <Pill isSuper>
            <Icon iconName="stars" size={24} color="#EC8E34" />
            {typeof bonusContent === 'string' ? (
              <Text variant="p3semi">{bonusContent}</Text>
            ) : (
              bonusContent
            )}
          </Pill>
        ) : null}
      </Text>
    </Tooltip>
  )
}
