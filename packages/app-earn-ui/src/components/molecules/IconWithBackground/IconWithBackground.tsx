import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'

import classNames from './IconWithBackground.module.scss'

export const IconWithBackground = ({
  iconName,
  color,
  size,
  with3rdLayer,
  backgroundSize = 100,
}: {
  iconName: IconNamesList
  color?: string
  size?: number
  with3rdLayer?: boolean
  backgroundSize?: number
}) => {
  return (
    <div className={classNames.wrapper}>
      <div
        className={classNames.firstLayerCircle}
        style={{ width: backgroundSize, height: backgroundSize }}
      >
        <div className={classNames.secondLayerCircle}>
          {with3rdLayer ? (
            <div className={classNames.thirdLayerCircle}>
              <Icon iconName={iconName} color={color} size={size} />
            </div>
          ) : (
            <Icon iconName={iconName} color={color} size={size} />
          )}
        </div>
      </div>
    </div>
  )
}
