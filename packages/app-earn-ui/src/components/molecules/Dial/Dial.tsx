/* eslint-disable  no-mixed-operators */
'use client'
import { type CSSProperties, type FC, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import dialStyles from '@/components/molecules/Dial/Dial.module.css'

interface DialProps {
  rawValue: ReactNode
  value: number
  max: number
  subtext?: ReactNode
  trackWidth?: 1 | 2 | 3 | 4
  icon?: IconNamesList
  iconSize?: number
  dialContainerStyle?: CSSProperties
  dialContainerClassName?: string
  gradientRotation?: number
  // flag for cases where there are multiple dials,
  // and we want to show 100% filled dial even though
  // value is 0
  showGradientWhenZeros?: boolean
  formatter?: (value: number) => string
}

export const Dial: FC<DialProps> = ({
  rawValue,
  value,
  max,
  trackWidth = 3,
  subtext,
  icon,
  iconSize,
  dialContainerStyle,
  dialContainerClassName,
  gradientRotation = 0,
  showGradientWhenZeros = false,
  formatter,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max)
  const progress = (normalizedValue / max) * 100
  const strokeDasharray = `${progress} ${100 - progress}`

  const trackWidthClass = `trackWidth-${Math.round(trackWidth)}` as keyof typeof dialStyles

  return (
    <div
      className={clsx(
        dialStyles.dialContainer,
        dialStyles[trackWidthClass],
        dialContainerClassName,
      )}
      style={dialContainerStyle}
    >
      <svg
        className={dialStyles.dial}
        viewBox="0 0 36 36"
        style={{ transform: `rotate(${gradientRotation}deg)` }}
      >
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#ff49a4" />
            <stop offset="100%" stopColor="#b049ff" />
          </linearGradient>
          <linearGradient id="trackGradient">
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
        {value === 0 && !showGradientWhenZeros ? null : (
          <path
            className={dialStyles.progress}
            strokeDasharray={strokeDasharray}
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        )}
      </svg>
      <div className={dialStyles.value}>
        {icon && <Icon iconName={icon} size={iconSize} />}
        {/* Suppress hydration warning for cases where it's counting based on seconds */}
        <Text as="h5" variant="h5" suppressHydrationWarning>
          {rawValue}
          {rawValue !== 0 && !rawValue && (
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
