import { Icon, type IconNamesList } from '@summerfi/app-earn-ui'

import classNames from './TransakIconWrapper.module.css'

export const TransakIconWrapper = ({
  icon,
  color,
  size,
  with3rdLayer,
}: {
  icon: IconNamesList
  color?: string
  size?: number
  with3rdLayer?: boolean
}) => {
  return (
    <div className={classNames.wrapper}>
      <div className={classNames.firstLayerCircle}>
        <div className={classNames.secondLayerCircle}>
          {with3rdLayer ? (
            <div className={classNames.thirdLayerCircle}>
              <Icon iconName={icon} color={color} size={size} />
            </div>
          ) : (
            <Icon iconName={icon} color={color} size={size} />
          )}
        </div>
      </div>
    </div>
  )
}
