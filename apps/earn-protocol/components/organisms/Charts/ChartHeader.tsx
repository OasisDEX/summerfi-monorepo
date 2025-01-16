import { Text, Timeframes, ToggleButton } from '@summerfi/app-earn-ui'
import { type TimeframesItem, type TimeframesType } from '@summerfi/app-types'

import classNames from './ChartHeader.module.scss'

type ChartHeaderProps = {
  title?: string
  compare?: boolean
  setCompare?: (value: boolean) => void
  timeframe?: TimeframesType
  timeframes: TimeframesItem
  setTimeframe?: (timeframe: string) => void
}

export const ChartHeader = ({
  title,
  compare = false,
  timeframe,
  setCompare,
  setTimeframe,
  timeframes,
}: ChartHeaderProps) => {
  return (
    <div className={classNames.wrapper}>
      {title && <Text variant="p2semi">{title}</Text>}
      {setCompare && (
        <ToggleButton
          checked={compare}
          title="Compare to others"
          onChange={() => setCompare(!compare)}
        />
      )}
      {timeframe && setTimeframe && (
        <Timeframes
          timeframes={timeframes}
          activeTimeframe={timeframe}
          setActiveTimeframe={setTimeframe}
        />
      )}
    </div>
  )
}
