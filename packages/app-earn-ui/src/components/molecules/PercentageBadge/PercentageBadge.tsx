import { type FC } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import classNames from './PercentageBadge.module.scss'

interface PercentageBadgeProps {
  value: string
  wrapperClassName?: string
  textClassName?: string
  isActive?: boolean
  onClick?: () => void
}

export const PercentageBadge: FC<PercentageBadgeProps> = ({
  value,
  wrapperClassName,
  textClassName,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={clsx(classNames.percentageBadgeWrapper, wrapperClassName, {
        [classNames.active]: isActive,
      })}
      onClick={onClick}
    >
      <Text as="p" variant="p4" className={textClassName}>
        {value}%
      </Text>
    </div>
  )
}
