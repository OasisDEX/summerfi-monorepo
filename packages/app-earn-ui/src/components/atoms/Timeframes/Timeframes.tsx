import { type TimeframesType } from '@summerfi/app-types'

import { Text } from '@/components/atoms/Text/Text'

import timeframesStyles from './Timeframes.module.scss'

export const Timeframes = ({
  timeframes,
  activeTimeframe,
  setActiveTimeframe,
}: {
  timeframes: Partial<TimeframesType[]>
  activeTimeframe: TimeframesType
  setActiveTimeframe: (timeframe: TimeframesType) => void
}) => {
  return (
    <div className={timeframesStyles.timeframesWrapper}>
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => timeframe && setActiveTimeframe(timeframe)}
          className={activeTimeframe === timeframe ? 'active' : ''}
        >
          <Text
            variant="p2semi"
            style={{
              color:
                timeframe === activeTimeframe
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-secondary)',
            }}
          >
            {timeframe}
          </Text>
        </button>
      ))}
    </div>
  )
}
