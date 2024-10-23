'use client'

import { type FC } from 'react'

import { LoadableAvatar } from '@/components/atoms/LoadableAvatar/LoadableAvatar'

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

  return (
    <div className={genericTokenIconStyles[variant]} style={customSize ? customSizeStyle : {}}>
      <LoadableAvatar
        size={innerSize}
        name={btoa(symbol)}
        variant="marble"
        colors={['#6FD9FF', '#FBB677']}
      />
      <div className={genericTokenIconStyles.unknownIcon} style={customSize ? customSizeStyle : {}}>
        ?
      </div>
    </div>
  )
}
