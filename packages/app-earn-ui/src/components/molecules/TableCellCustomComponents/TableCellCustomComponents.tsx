import { type ReactNode } from 'react'

import { ChartBar } from '@/components/atoms/ChartBar/ChartBar'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import tableCellCustomComponentsStyles from './TableCellCustomComponents.module.scss'

export const TableCellAllocationCap = ({
  capPercent,
  tooltipContent,
  isBuffer = false,
}: {
  capPercent: string
  tooltipContent?: ReactNode
  isBuffer?: boolean
}): ReactNode => {
  return (
    <div className={tableCellCustomComponentsStyles.tableCellAllocationCapWrapper}>
      <div className={tableCellCustomComponentsStyles.tableCellAllocationCapPercentTooltipWrapper}>
        <Text variant="p3semi">{!isBuffer ? capPercent : 'n/a'}</Text>
        {tooltipContent && !isBuffer && (
          <Tooltip
            tooltip={tooltipContent}
            tooltipWrapperStyles={{ maxWidth: '260px', width: '260px' }}
          >
            <Icon iconName="info" size={20} color="#777576" />
          </Tooltip>
        )}
      </div>
      {!isBuffer && <ChartBar value={capPercent} />}
    </div>
  )
}

export const TableCellAllocationCapTooltipDataBlock = ({
  title,
  value,
}: {
  title: string
  value: string | ReactNode
}): ReactNode => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-2x-small)' }}>
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
        {title}
      </Text>
      <Text variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
        {value}
      </Text>
    </div>
  )
}
