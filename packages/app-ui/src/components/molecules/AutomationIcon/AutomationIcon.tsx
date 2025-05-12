import { type FC, type ReactNode } from 'react'

import { Icon, type IconPropsBase } from '@/components/atoms/Icon/Icon'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import automationIconStyles from '@/components/molecules/AutomationIcon/AutomationIcon.module.css'

interface AutomationIconProps {
  tooltip: ReactNode
  enabled?: boolean
  variant?: IconPropsBase['variant']
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

export const AutomationIcon: FC<AutomationIconProps> = ({ enabled, type, tooltip, variant }) => {
  return (
    <Tooltip tooltip={tooltip}>
      <div
        className={
          enabled
            ? automationIconStyles.iconWrapperActive
            : automationIconStyles.iconWrapperNotActive
        }
      >
        <Icon iconName={type} variant={variant ? variant : 'm'} />
      </div>
    </Tooltip>
  )
}
