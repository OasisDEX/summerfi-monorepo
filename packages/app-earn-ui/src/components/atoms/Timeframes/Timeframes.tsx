import { type TimeframesItem, type TimeframesType } from '@summerfi/app-types'

import { Text } from '@/components/atoms/Text/Text'

import timeframesStyles from './Timeframes.module.css'

export const Timeframes = ({
  timeframes,
  activeTimeframe,
  setActiveTimeframe,
}: {
  timeframes: TimeframesItem
  activeTimeframe: TimeframesType
  setActiveTimeframe: (timeframe: TimeframesType) => void
}): React.ReactNode => {
  return (
    <div className={timeframesStyles.timeframesWrapper}>
      {Object.keys(timeframes).map((timeframe: TimeframesType) => (
        <button
          key={timeframe}
          onClick={() => setActiveTimeframe(timeframe)}
          className={activeTimeframe === timeframe ? 'active' : ''}
          style={
            !timeframes[timeframe]
              ? {
                  opacity: 0.2,
                  pointerEvents: 'none',
                }
              : {}
          }
        >
          <Text
            variant="p2semi"
            style={{
              color:
                timeframe === activeTimeframe
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-secondary-disabled)',
            }}
          >
            {timeframe}
          </Text>
        </button>
      ))}
    </div>
  )
}
