import { type CSSProperties } from 'react'
import clsx from 'clsx'

import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'

import classNames from './IconWithBackground.module.css'

export const IconWithBackground = ({
  iconName,
  color,
  size,
  with3rdLayer,
  backgroundSize = 100,
  wrapperStyle,
  wrapperClassName,
}: {
  iconName: IconNamesList
  color?: string
  size?: number
  with3rdLayer?: boolean
  backgroundSize?: number
  wrapperStyle?: CSSProperties
  wrapperClassName?: string
}): React.ReactNode => {
  return (
    <div className={clsx(classNames.wrapper, wrapperClassName)} style={wrapperStyle}>
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
