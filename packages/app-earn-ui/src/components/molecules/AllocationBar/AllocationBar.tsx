'use client'

import { type FC, type ReactNode } from 'react'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import allocationBarStyles from './AllocationBar.module.css'

interface TooltipContentProps {
  label: string
  percentage: number
}

const TooltipContent: FC<TooltipContentProps> = ({ label, percentage }) => {
  return (
    <Text as="div" variant="p4semi">
      {label}{' '}
      <Text as="span" variant="p4semiColorful">
        {formatDecimalAsPercent(percentage)}
      </Text>
    </Text>
  )
}

interface AllocationBarProps {
  items: {
    label: string
    percentage: number
    color: string
    tooltip?: ReactNode
  }[]
  variant?: 'large' | 'medium' | 'small'
}

export const AllocationBar: FC<AllocationBarProps> = ({ variant = 'large', items }) => {
  return (
    <div className={clsx(allocationBarStyles.allocationBar, allocationBarStyles[variant])}>
      {items.map((item, idx) => (
        <Tooltip
          key={`${item.label}-${idx}`}
          tooltip={item.tooltip ?? <TooltipContent {...item} />}
          style={{ width: `${item.percentage * 100}%`, height: '100%' }}
          tooltipWrapperStyles={{ minWidth: '300px', top: '24px' }}
          tooltipCardVariant="cardPrimarySmallPaddings"
        >
          <div
            className={allocationBarStyles.allocationBarItem}
            style={{
              backgroundColor: item.color,
            }}
          />
        </Tooltip>
      ))}
    </div>
  )
}
