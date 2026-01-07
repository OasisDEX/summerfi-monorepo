'use client'
import { type ReactNode, useMemo } from 'react'
import { Tooltip } from '@summerfi/app-earn-ui'
import dayjs from 'dayjs'

import { formatStakeLockupPeriod } from '@/helpers/format-stake-lockup-period'

const TableRightCell = ({ children, title }: { title?: string; children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }} title={title}>
      {children}
    </div>
  )
}

export const LockPeriodCell = ({
  lockupPeriod,
  lockupEndTime,
}: {
  lockupPeriod: number
  lockupEndTime: number
}) => {
  const now = dayjs()
  const unlockTime = dayjs.unix(Number(lockupEndTime))
  const daysToUnlock = unlockTime.diff(now, 'days')
  const hoursToUnlock = unlockTime.diff(now, 'hours')
  const minutesToUnlock = unlockTime.diff(now, 'minutes') % 60

  const tooltipText = useMemo(() => {
    if (Number(lockupPeriod) === 0) {
      return 'This stake has no lockup period and can be removed at any time without penalty.'
    }

    if (daysToUnlock <= 0 && hoursToUnlock <= 0) {
      return `This stake is was unlocked ${unlockTime.fromNow()} and can be removed without penalty.`
    }

    if (daysToUnlock < 7) {
      // Less than seven days - show hours and minutes
      const hourLabel = hoursToUnlock === 1 ? 'hour' : 'hours'
      const minuteLabel = minutesToUnlock === 1 ? 'minute' : 'minutes'

      if (hoursToUnlock > 0 && minutesToUnlock > 0) {
        return `This stake will unlock in ${hoursToUnlock} ${hourLabel} and ${minutesToUnlock} ${minuteLabel}.`
      } else if (hoursToUnlock > 0) {
        return `This stake will unlock in ${hoursToUnlock} ${hourLabel}.`
      } else {
        return `This stake will unlock in ${minutesToUnlock} ${minuteLabel}.`
      }
    }

    // Seven days or more
    return `This stake will unlock in ${daysToUnlock} day${daysToUnlock === 1 ? '' : 's'}.`
  }, [daysToUnlock, hoursToUnlock, lockupPeriod, minutesToUnlock, unlockTime])

  return (
    <TableRightCell>
      <Tooltip
        tooltip={<span style={{ textAlign: 'center' }}>{tooltipText}</span>}
        tooltipWrapperStyles={{
          minWidth: '280px',
        }}
      >
        <span>{formatStakeLockupPeriod(lockupPeriod)}</span>
      </Tooltip>
    </TableRightCell>
  )
}
