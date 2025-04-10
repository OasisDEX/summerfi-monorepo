import { type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import tableCellCustomComponentsStyles from './TableCellCustomComponents.module.scss'

export const TableCellAllocationCap = ({
  capPercent,
  tooltipContent,
}: {
  capPercent: string
  tooltipContent?: ReactNode
}): ReactNode => {
  return (
    <div className={tableCellCustomComponentsStyles.tableCellAllocationCapWrapper}>
      <div className={tableCellCustomComponentsStyles.tableCellAllocationCapPercentTooltipWrapper}>
        <Text variant="p3semi">{capPercent}</Text>
        {tooltipContent && (
          <Tooltip tooltip={tooltipContent}>
            <Icon iconName="info" size={20} color="#777576" />
          </Tooltip>
        )}
      </div>
      <div className={tableCellCustomComponentsStyles.tableCellAllocationCapBar}>
        <div
          className={tableCellCustomComponentsStyles.tableCellAllocationCapBarFilled}
          style={{
            width: capPercent,
          }}
        />
      </div>
    </div>
  )
}
