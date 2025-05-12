/* eslint-disable  no-mixed-operators */
import { type FC, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import dialStyles, {
  type ClassNames as DialClassnames,
} from '@/components/molecules/Dial/Dial.module.css'

interface DialProps {
  value: number
  max: number
  subtext?: ReactNode
  trackWidth?: 1 | 2 | 3 | 4
  icon?: IconNamesList
  iconSize?: number
  formatter?: (value: number) => string
}

export const Dial: FC<DialProps> = ({
  value,
  formatter,
  max,
  trackWidth = 2,
  subtext,
  icon,
  iconSize,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max)
  const progress = (normalizedValue / max) * 100
  const strokeDasharray = `${progress} ${100 - progress}`

  const trackWidthClass = `trackWidth-${Math.round(trackWidth)}` as DialClassnames
  const gradientRotation = -180

  // Calculate gradient coordinates based on rotation angle
  const startX = 50 + Math.cos((gradientRotation - 90) * (Math.PI / 180)) * 50
  const startY = 50 + Math.sin((gradientRotation - 90) * (Math.PI / 180)) * 50
  const endX = 50 + Math.cos((gradientRotation + 90) * (Math.PI / 180)) * 50
  const endY = 50 + Math.sin((gradientRotation + 90) * (Math.PI / 180)) * 50

  return (
    <div className={clsx(dialStyles.dialContainer, dialStyles[trackWidthClass])}>
      <svg className={dialStyles.dial} viewBox="0 0 36 36">
        <defs>
          <linearGradient
            id="gradient"
            x1={`${startX}%`}
            y1={`${startY}%`}
            x2={`${endX}%`}
            y2={`${endY}%`}
          >
            <stop offset="0.02%" stopColor="#007da3" />
            <stop offset="56.92%" stopColor="#e7a77f" />
            <stop offset="98.44%" stopColor="#e97047" />
          </linearGradient>
          <linearGradient
            id="trackGradient"
            x1={`${startX}%`}
            y1={`${startY}%`}
            x2={`${endX}%`}
            y2={`${endY}%`}
          >
            <stop offset="0.02%" stopColor="rgba(0, 125, 163, 0.2)" />
            <stop offset="56.92%" stopColor="rgba(231, 167, 127, 0.2)" />
            <stop offset="98.44%" stopColor="rgba(233, 112, 71, 0.2)" />
          </linearGradient>
        </defs>
        <path
          className={dialStyles.track}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={dialStyles.progress}
          strokeDasharray={strokeDasharray}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className={dialStyles.value}>
        {icon && <Icon iconName={icon} size={iconSize} />}
        <Text as="h3" variant="h3">
          {formatter ? formatter(value) : value} / {formatter ? formatter(max) : max}
        </Text>
        {typeof subtext === 'string' ? (
          <Text as="p" variant="p1semi" style={{ color: 'var(--color-neutral-80' }}>
            {subtext}
          </Text>
        ) : (
          subtext
        )}
      </div>
    </div>
  )
}
