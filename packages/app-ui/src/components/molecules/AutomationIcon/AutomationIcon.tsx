import { FC, ReactNode } from 'react'

import { Icon, IconProps } from '@/components/atoms/Icon/Icon'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { autoBuy, autoSell, stopLoss, takeProfit } from '@/icons'

import classNames from '@/components/molecules/AutomationIcon/AutomationIcon.module.scss'

interface AutomationIconProps {
  tooltip: ReactNode
  type: 'autoBuy' | 'autoSell' | 'stopLoss' | 'takeProfit'
  enabled?: boolean
}

const automationIconMap: { [key: string]: IconProps['icon'] } = {
  autoBuy,
  autoSell,
  stopLoss,
  takeProfit,
}

export const AutomationIcon: FC<AutomationIconProps> = ({ enabled, type, tooltip }) => {
  return (
    <Tooltip tooltip={tooltip}>
      <div className={enabled ? classNames.iconWrapperActive : classNames.iconWrapperNotActive}>
        <Icon icon={automationIconMap[type]} variant="m" />
      </div>
    </Tooltip>
  )
}
