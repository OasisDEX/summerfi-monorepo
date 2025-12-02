import { useMemo } from 'react'
import { Icon, Text, Tooltip } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import lockupRangeGraphStyles from './LockupRangeGraph.module.css'

export const LockupRangeGraph = ({
  lockupMap,
  onLockupClick,
  selectedBucketIndex,
}: {
  lockupMap: {
    // key is the number of days, starting at 14 (minimum) to 1080 (maximum)
    [key: number]: 'low' | 'medium' | 'high'
  }
  selectedBucketIndex?: number
  onLockupClick?: (days: number) => void
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
        <Tooltip
          tooltip={
            <div className={lockupRangeGraphStyles.lockupRangeGraphTooltip}>
              <Text variant="h5">SUMR Staking is based on availability per bucket.</Text>
              <Text variant="p3">
                Lock buckets have fixed slots. What’s left determines your max stake and USD and
                SUMR APY.
              </Text>
              <Text variant="p3">
                Color’s show how much of your available SUMR fits in each bucket. See details for
                exact remaining capacity.
              </Text>
              <Text variant="p3">
                If you do not lock all of your available SUMR, you can lock remaining SUMR at
                different lock buckets.
              </Text>
              <Text
                variant="p3semi"
                className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChartDescription}
                style={{ marginTop: '12px' }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-text-success)',
                  }}
                  className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChart}
                />
                100% of your available SUMR can be locked.
              </Text>
              <Text
                variant="p3semi"
                className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChartDescription}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-text-warning)',
                  }}
                  className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChart}
                />
                Some of your available SUMR can be locked.
              </Text>
              <Text
                variant="p3semi"
                className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChartDescription}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-text-critical)',
                  }}
                  className={lockupRangeGraphStyles.lockupRangeGraphTooltipMiniChart}
                />
                There is no available capacity for your SUMR.
              </Text>
            </div>
          }
          tooltipWrapperStyles={{ minWidth: '540px' }}
        >
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
        {calculatedBarWidths.map(({ days, level, widthPercent, timespanLabel }, bucketIndex) => (
          <div
            key={days}
            className={clsx(
              lockupRangeGraphStyles.lockupRangeGraphBar,
              lockupRangeGraphStyles[level],
              {
                [lockupRangeGraphStyles.clickable]: Boolean(onLockupClick),
                [lockupRangeGraphStyles[`highlightAnimation_${level}`]]:
                  selectedBucketIndex === bucketIndex,
              },
            )}
            style={{
              width: `${widthPercent}%`,
            }}
            onClick={() => {
              // calculate the middle of the range for this bucket
              const previousDays =
                bucketIndex === 0 ? 14 : calculatedBarWidths[bucketIndex - 1].days
              const middleDays = Math.round((previousDays + days) / 2)

              onLockupClick?.(middleDays)
            }}
          >
            <span>{timespanLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
