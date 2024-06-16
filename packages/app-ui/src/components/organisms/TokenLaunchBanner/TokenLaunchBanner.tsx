/* eslint-disable no-magic-numbers */

import { FC } from 'react'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/organisms/TokenLaunchBanner/TokensLaunchBanner.module.scss'

type TimeUntil = {
  weeks: number
  days: number
  hours: number
  minutes: number
}

const timeUntil = (timestamp: string): TimeUntil => {
  const now: Date = new Date()
  const futureDate: Date = new Date(timestamp)
  const diff: number = futureDate.getTime() - now.getTime()

  if (diff <= 0) {
    return {
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }

  const minutes: number = Math.floor(diff / 1000 / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)
  const weeks: number = Math.floor(days / 7)

  const remainingDays: number = days % 7
  const remainingHours: number = hours % 24
  const remainingMinutes: number = minutes % 60

  return {
    weeks,
    days: remainingDays,
    hours: remainingHours,
    minutes: remainingMinutes,
  }
}

interface CountDownItemProps {
  title: string
  value: number
}

const CountDownItem: FC<CountDownItemProps> = ({ title, value }) => {
  return (
    <div className={classNames.countDownItem}>
      <Text as="h4" variant="h4">
        {value}
      </Text>
      <Text as="p" variant="p4semi" style={{ color: 'var(--color-primary-30)' }}>
        {title}
      </Text>
    </div>
  )
}

export const TokenLaunchBanner = () => {
  // TODO update once date will be known
  const futureTimestamp = '2024-12-25T00:00:00'
  const { weeks, days, hours, minutes } = timeUntil(futureTimestamp)

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.content}>
        <Text as="p" variant="p2semi" style={{ color: 'var(--color-primary-30)' }}>
          DeFi is about to get a lot easier
        </Text>
        <Text as="h5" variant="h5">
          Summer.fi Token launch 👉
        </Text>
        <Text as="p" variant="p2semi">
          <Link href="/">Read announcement →</Link>
        </Text>
      </div>
      <div className={classNames.countDown}>
        <CountDownItem title="Weeks" value={weeks} />
        <CountDownItem title="Days" value={days} />
        <CountDownItem title="Hours" value={hours} />
        <CountDownItem title="Minutes" value={minutes} />
      </div>
    </div>
  )
}
