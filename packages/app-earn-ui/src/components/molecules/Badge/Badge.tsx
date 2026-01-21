import { type CSSProperties, type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import classNames from './Badge.module.css'

interface BadgeProps {
  value: ReactNode
  wrapperClassName?: string
  textClassName?: string
  isActive?: boolean
  onClick?: () => void
  disabled?: boolean
  wrapperStyle?: CSSProperties
  textStyle?: CSSProperties
}

export const Badge: FC<BadgeProps> = ({
  value,
  wrapperClassName,
  textClassName,
  isActive,
  onClick,
  disabled,
  wrapperStyle,
  textStyle,
}) => {
  return (
    <div
      className={clsx(classNames.badgeWrapper, wrapperClassName, {
        [classNames.active]: isActive,
        [classNames.disabled]: disabled,
      })}
      style={wrapperStyle}
      onClick={disabled ? undefined : onClick}
    >
      <Text as="p" variant="p4semi" className={textClassName} style={textStyle}>
        {value}
      </Text>
    </div>
  )
}
