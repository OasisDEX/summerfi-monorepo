import { FC, ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import classNames from '@/components/molecules/AutomationIcon/AutomationIcon.module.scss'

interface AutomationIconProps {
  tooltip: ReactNode
  enabled?: boolean
  type:
    | 'autoBuy'
    | 'autoSell'
    | 'stopLoss'
    | 'takeProfit'
    | 'trailingStopLoss'
    | 'partialTakeProfit'
    | 'autoTakeProfit'
    | 'constantMultiple'
}

export const AutomationIcon: FC<AutomationIconProps> = ({ enabled, type, tooltip }) => {
  return (
    <Tooltip tooltip={tooltip}>
      <div className={enabled ? classNames.iconWrapperActive : classNames.iconWrapperNotActive}>
        <Icon iconName={type} variant="m" />
      </div>
    </Tooltip>
  )
}
