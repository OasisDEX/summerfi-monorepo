import { type FC } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import classNames from './Badge.module.scss'

interface BadgeProps {
  value: string
  wrapperClassName?: string
  textClassName?: string
  isActive?: boolean
  onClick?: () => void
}

export const Badge: FC<BadgeProps> = ({
  value,
  wrapperClassName,
  textClassName,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={clsx(classNames.badgeWrapper, wrapperClassName, {
        [classNames.active]: isActive,
      })}
      onClick={onClick}
    >
      <Text as="p" variant="p4semi" className={textClassName}>
        {value}
      </Text>
    </div>
  )
}
