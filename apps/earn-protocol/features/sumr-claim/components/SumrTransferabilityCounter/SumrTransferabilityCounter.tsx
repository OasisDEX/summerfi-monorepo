'use client'
import { useEffect, useState } from 'react'
import { Dial, Text } from '@summerfi/app-earn-ui'

import classNames from './SumrTransferabilityCounter.module.scss'

const getTimeDifference = (
  startDate: number,
  targetDate: number,
): { d: number; h: number; m: number; s: number } => {
  const timeDifference = Math.abs(targetDate - startDate) / 1000 // get the difference in seconds

  const days = Math.floor(timeDifference / 86400)
  const hours = Math.floor((timeDifference % 86400) / 3600)
  const minutes = Math.floor(((timeDifference % 86400) % 3600) / 60)
  const seconds = Math.floor(((timeDifference % 86400) % 3600) % 60)

  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  }
}

const startDate = new Date('2024-12-01T10:00:00').getTime()
const targetDate = new Date('2025-01-30T10:32:02').getTime()

const initialTime = getTimeDifference(startDate, targetDate)

export const SumrTransferabilityCounter = () => {
  const [time, setTime] = useState(getTimeDifference(Date.now(), targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(() => {
        const newTime = getTimeDifference(Date.now(), targetDate)

        if (newTime.d === 0 && newTime.h === 0 && newTime.m === 0 && newTime.s === 0) {
          clearInterval(interval)
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames.sumrTransferabilityCounterWrapper}>
      <Text as="p" variant="p3semi" className={classNames.heading}>
        Governance can enable transferability in
      </Text>
      <div className={classNames.dialsWrapper}>
        <div className={classNames.dialWrapper}>
          <Dial
            trackWidth={1}
            value={time.d}
            max={initialTime.d}
            rawValue={time.d}
            dialContainerClassName={classNames.dialCustomSize}
          />
          <Text as="p" variant="p4semi">
            D
          </Text>
        </div>
        <div className={classNames.dialWrapper}>
          <Dial
            trackWidth={1}
            value={time.h}
            max={time.d === 0 ? 24 : time.h}
            rawValue={time.h}
            dialContainerClassName={classNames.dialCustomSize}
            showGradientWhenZeros={time.d !== 0}
          />
          <Text as="p" variant="p4semi">
            Hrs
          </Text>
        </div>

        <div className={classNames.dialWrapper}>
          <Dial
            trackWidth={1}
            value={time.m}
            max={time.h === 0 && time.d === 0 ? 60 : time.m}
            rawValue={time.m}
            dialContainerClassName={classNames.dialCustomSize}
            showGradientWhenZeros={time.h !== 0 || time.d !== 0}
          />
          <Text as="p" variant="p4semi">
            Mins
          </Text>
        </div>
        <div className={classNames.dialWrapper}>
          <Dial
            trackWidth={1}
            value={time.s}
            max={time.h === 0 && time.d === 0 && time.m === 0 ? 60 : time.s}
            rawValue={time.s}
            dialContainerClassName={classNames.dialCustomSize}
            showGradientWhenZeros={time.h !== 0 || time.d !== 0 || time.m !== 0}
          />
          <Text as="p" variant="p4semi">
            Secs
          </Text>
        </div>
      </div>
    </div>
  )
}
