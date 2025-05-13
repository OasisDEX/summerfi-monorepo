'use client'

import { type FC } from 'react'
import loadable from '@loadable/component'
import { safeBTOA } from '@summerfi/app-utils'

import genericTokenIconStyles, {
  type ClassNames,
} from '@/components/atoms/GenericTokenIcon/GenericTokenIcon.module.css'

interface GenericTokenIconProps {
  variant?: ClassNames
  className?: string
  symbol: string
}

const scaleFactor = 0.8125

export const GenericTokenIcon: FC<GenericTokenIconProps> = ({ variant = 'smallIcon', symbol }) => {
  const size = variant === 'smallIcon' ? 30 : 44

  const innerSize = size * scaleFactor

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
    <div className={genericTokenIconStyles[variant]}>
      <AvatarLoadingState
        size={innerSize}
        name={safeBTOA(symbol)}
        variant="marble"
        colors={['#6FD9FF', '#F2FCFF', '#FFE7D8', '#FBB677']}
      />
      <div className={genericTokenIconStyles.unknownIcon}>?</div>
    </div>
  )
}
