'use client'
import { type FC, useEffect, useMemo, useState } from 'react'
import { timeUntil } from '@summerfi/app-utils'

import { CountDownItem } from '@/components/molecules/CountDownItem/CountDownItem'

import countdownStyles from '@/components/organisms/CountDown/CountDown.module.css'

interface CountDownProps {
  futureTimestamp: string
  variant?: keyof typeof countdownStyles
  itemVariant?: 'large' | 'medium' | 'small'
}

export const CountDown: FC<CountDownProps> = ({
  futureTimestamp,
  variant = 'countDown',
  itemVariant,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeUntil(futureTimestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeUntil(futureTimestamp))
    }, 1000)

    return () => clearInterval(interval)
  }, [futureTimestamp])

  const itemVariantFinal = itemVariant ? itemVariant : variant === 'countDown' ? 'large' : 'medium'

  const { weeks, days, hours, minutes, seconds } = timeLeft

  const progress = useMemo(() => {
    return {
      daysProgress: hours / 24,
      hoursProgress: minutes / 60,
      minutesProgress: seconds / 60,
    }
  }, [hours, minutes, seconds])

  return (
    <div className={countdownStyles[variant]}>
      <CountDownItem
        title="Days"
        value={days + Number(weeks * 7)}
        variant={itemVariantFinal}
        progress={progress.daysProgress}
      />
      <CountDownItem
        title="Hours"
        value={hours}
        variant={itemVariantFinal}
        progress={progress.hoursProgress}
      />
      <CountDownItem
        title="Minutes"
        value={minutes}
        variant={itemVariantFinal}
        progress={progress.minutesProgress}
      />
      <CountDownItem title="Seconds" value={seconds} variant={itemVariantFinal} secondsProgress />
    </div>
  )
}
