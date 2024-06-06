/* eslint-disable no-magic-numbers */
/* eslint-disable  no-mixed-operators */
import { FC, ReactNode } from 'react'
import Image from 'next/image'

import { Text } from '@/components/atoms/Text/Text'

import classNames, { ClassNames } from '@/components/molecules/Dial/Dial.module.scss'

interface DialProps {
  value: number
  max: number
  subtext?: ReactNode
  trackWidth?: 1 | 2 | 3 | 4
  icon?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export const Dial: FC<DialProps> = ({ value, max, trackWidth = 2, subtext, icon }) => {
  const normalizedValue = Math.min(Math.max(value, 0), max)
  const progress = (normalizedValue / max) * 100
  const strokeDasharray = `${progress} ${100 - progress}`

  const trackWidthClass = `trackWidth-${Math.round(trackWidth)}` as ClassNames
  const gradientRotation = -180

  // Calculate gradient coordinates based on rotation angle
  const startX = 50 + Math.cos((gradientRotation - 90) * (Math.PI / 180)) * 50
  const startY = 50 + Math.sin((gradientRotation - 90) * (Math.PI / 180)) * 50
  const endX = 50 + Math.cos((gradientRotation + 90) * (Math.PI / 180)) * 50
  const endY = 50 + Math.sin((gradientRotation + 90) * (Math.PI / 180)) * 50

  return (
    <div className={[classNames.dialContainer, classNames[trackWidthClass]].join(' ')}>
      <svg className={classNames.dial} viewBox="0 0 36 36">
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
          className={classNames.track}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={classNames.progress}
          strokeDasharray={strokeDasharray}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className={classNames.value}>
        {icon && <Image src={icon.src} alt="dial-icon" width={icon.width} height={icon.height} />}
        <Text as="h3" variant="h3">
          {value} / {max}
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
