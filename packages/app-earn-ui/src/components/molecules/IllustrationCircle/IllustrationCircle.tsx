import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'

import classNames from './IllustrationCircle.module.css'

type IllustrationCircleSize = 'small' | 'medium' | 'large' | 'extraLarge'

export const IllustrationCircle = ({
  icon,
  color,
  size = 'medium',
  with3rdLayer,
  iconSize,
}: {
  icon: IconNamesList
  color?: string
  size?: IllustrationCircleSize
  with3rdLayer?: boolean
  iconSize?: number
}): React.ReactNode => {
  return (
    <div className={`${classNames[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`]}`}>
      <div className={classNames.firstLayerCircle}>
        <div className={classNames.secondLayerCircle}>
          {with3rdLayer ? (
            <div className={classNames.thirdLayerCircle}>
              <Icon
                iconName={icon}
                color={color}
                size={
                  iconSize ??
                  (['extraLarge', 'large'].includes(size) ? 32 : size === 'medium' ? 24 : 16)
                }
              />
            </div>
          ) : (
            <Icon
              iconName={icon}
              color={color}
              size={
                iconSize ??
                (['extraLarge', 'large'].includes(size) ? 32 : size === 'medium' ? 24 : 16)
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
