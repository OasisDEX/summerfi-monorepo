/* eslint-disable  no-mixed-operators */
import { type FC, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import dialStyles, {
  type ClassNames as DialClassnames,
} from '@/components/molecules/Dial/Dial.module.scss'

interface DialProps {
  rawValue: ReactNode
  value: number
  max: number
  subtext?: ReactNode
  trackWidth?: 1 | 2 | 3 | 4
  icon?: IconNamesList
  iconSize?: number
  formatter?: (value: number) => string
}

export const Dial: FC<DialProps> = ({
  rawValue,
  value,
  formatter,
  max,
  trackWidth = 3,
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
            <stop offset="0%" stopColor="#ff49a4" />
            <stop offset="100%" stopColor="#b049ff" />
          </linearGradient>
          <linearGradient
            id="trackGradient"
            x1={`${startX}%`}
            y1={`${startY}%`}
            x2={`${endX}%`}
            y2={`${endY}%`}
          >
            <stop offset="0%" stopColor="var(--earn-protocol-neutral-60)" />
            <stop offset="100%" stopColor="var(--earn-protocol-neutral-60)" />
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
        <Text as="h5" variant="h5">
          {rawValue}
          {!rawValue && (
            <>
              {formatter ? formatter(value) : value} / {formatter ? formatter(max) : max}
            </>
          )}
        </Text>
        {typeof subtext === 'string' ? (
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60' }}>
            {subtext}
          </Text>
        ) : (
          subtext
        )}
      </div>
    </div>
  )
}
