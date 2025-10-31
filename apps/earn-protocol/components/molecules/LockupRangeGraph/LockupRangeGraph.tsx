import { useMemo } from 'react'
import { Icon, Text, Tooltip } from '@summerfi/app-earn-ui'

import lockupRangeGraphStyles from './LockupRangeGraph.module.css'

export const LockupRangeGraph = ({
  lockupMap,
}: {
  lockupMap: {
    // key is the number of days, starting at 14 (minimum) to 1080 (maximum)
    [key: number]: 'low' | 'medium' | 'high'
  }
}) => {
  // the minimum lockup is 14 days

  const calculatedBarWidths = useMemo(() => {
    const entries = Object.entries(lockupMap).map(([days, level]) => ({
      days: Number(days),
      level,
    }))

    const totalDays = 1080 - 14 // max - min

    return entries.map(({ days, level }, index) => {
      const previousDays = index === 0 ? 14 : entries[index - 1].days
      const barDays = days - previousDays
      const widthPercent = (barDays / totalDays) * 100

      // timespan for the labels:
      // 2w-3m
      // 3 - 6m
      // 6 - 12m
      // 12-24m
      // 24-36m
      const timespanLabel =
        index === 0 ? (
          <>&lt;&nbsp;3m</>
        ) : (
          <>
            {Math.round(previousDays / 30)}-{Math.round(days / 30)}m
          </>
        )

      return {
        days,
        level,
        widthPercent,
        timespanLabel,
      }
    })
  }, [lockupMap])

  return (
    <div className={lockupRangeGraphStyles.lockupRangeGraph}>
      <div className={lockupRangeGraphStyles.lockupRangeGraphTitle}>
        <Text variant="p4semi">Staking availability</Text>
        <Tooltip tooltip="Huh?">
          <Icon iconName="question_o" size={16} />
        </Tooltip>
      </div>
      <div className={lockupRangeGraphStyles.lockupRangeGraphBars}>
        {/* <div
          // gray bar for 0-14d - if needed later
          className={`${lockupRangeGraphStyles.lockupRangeGraphBar} ${lockupRangeGraphStyles.gray}`}
          style={{
            width: `${(14 / (1080 - 14)) * 100}%`,
          }}
        /> */}
        {calculatedBarWidths.map(({ days, level, widthPercent, timespanLabel }) => (
          <div
            key={days}
            className={`${lockupRangeGraphStyles.lockupRangeGraphBar} ${lockupRangeGraphStyles[level]}`}
            style={{
              width: `${widthPercent}%`,
            }}
          >
            <span>{timespanLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
