import React, { FC } from 'react'
import Avatar from 'boring-avatars'

import classNames, {
  ClassNames,
} from '@/components/atoms/GenericTokenIcon/GenericTokenIcon.module.scss'

interface GenericTokenIconProps {
  variant?: ClassNames
  className?: string
  symbol: string
}

const scaleFactor = 0.8125

export const GenericTokenIcon: FC<GenericTokenIconProps> = ({ variant = 'smallIcon', symbol }) => {
  // eslint-disable-next-line no-magic-numbers
  const size = variant === 'smallIcon' ? 30 : 44

  // eslint-disable-next-line no-magic-numbers
  const innerSize = size * scaleFactor

  return (
    <div className={classNames[variant]}>
      <Avatar
        size={innerSize}
        name={btoa(symbol)}
        variant="marble"
        colors={['#6FD9FF', '#F2FCFF', '#FFE7D8', '#FBB677']}
      />
      <div className={classNames.unknownIcon}>?</div>
    </div>
  )
}
