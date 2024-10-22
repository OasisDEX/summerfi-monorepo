'use client'

import { type FC } from 'react'
import loadable from '@loadable/component'

import genericTokenIconStyles, {
  type ClassNames,
} from '@/components/atoms/GenericTokenIcon/GenericTokenIcon.module.scss'

interface GenericTokenIconProps {
  variant?: ClassNames
  className?: string
  symbol: string
  customSize?: number
}

const scaleFactor = 0.8125

export const GenericTokenIcon: FC<GenericTokenIconProps> = ({
  variant = 'smallIcon',
  symbol,
  customSize,
}) => {
  const size = variant === 'smallIcon' ? 30 : 44

  const innerSize = customSize ?? size * scaleFactor

  const customSizeStyle = {
    width: `${customSize}px`,
    height: `${customSize}px`,
    lineHeight: `${customSize}px`,
  }

  const AvatarLoadingState = loadable(() => import('boring-avatars'), {
    cacheKey: () => symbol,
    fallback: (
      <svg viewBox="0 0 6.35 6.35" color="inherit" display="inline-block" width={24} height={24}>
        <circle
          style={{ fill: '#9d9d9d', fillOpacity: 0.350168, strokeWidth: 0.340624 }}
          cx="3.175"
          cy="3.175"
          r="3.175"
        />
      </svg>
    ),
  })

  return (
    <div className={genericTokenIconStyles[variant]} style={customSize ? customSizeStyle : {}}>
      <AvatarLoadingState
        size={innerSize}
        name={btoa(symbol)}
        variant="marble"
        colors={['#6FD9FF', '#F2FCFF', '#FFE7D8', '#FBB677']}
      />
      <div className={genericTokenIconStyles.unknownIcon} style={customSize ? customSizeStyle : {}}>
        ?
      </div>
    </div>
  )
}
