import { type FC } from 'react'

import { CountDownItem } from '@/components/molecules/CountDownItem/CountDownItem'
import { timeUntil } from '@/helpers/time-until'

import countdownStyles, {
  type ClassNames,
} from '@/components/organisms/CountDown/CountDown.module.scss'

interface CountDownProps {
  futureTimestamp: string
  variant?: ClassNames
}

export const CountDown: FC<CountDownProps> = ({ futureTimestamp, variant = 'countDown' }) => {
  const { weeks, days, hours, minutes } = timeUntil(futureTimestamp)

  const itemVariant = variant === 'countDown' ? 'large' : 'medium'

  return (
    <div className={countdownStyles[variant]}>
      <CountDownItem title="Weeks" value={weeks} variant={itemVariant} />
      <CountDownItem title="Days" value={days} variant={itemVariant} />
      <CountDownItem title="Hours" value={hours} variant={itemVariant} />
      <CountDownItem title="Minutes" value={minutes} variant={itemVariant} />
    </div>
  )
}
