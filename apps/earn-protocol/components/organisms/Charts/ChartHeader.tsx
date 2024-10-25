import { Timeframes, ToggleButton } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'

import classNames from './ChartHeader.module.scss'

type ChartHeaderProps = {
  compare: boolean
  setCompare: (value: boolean) => void
  timeframe: TimeframesType
  setTimeframe: (timeframe: string) => void
}

export const ChartHeader = ({ compare, timeframe, setCompare, setTimeframe }: ChartHeaderProps) => {
  return (
    <div className={classNames.wrapper}>
      <ToggleButton
        checked={compare}
        title="Compare to others"
        onChange={() => setCompare(!compare)}
      />
      <Timeframes
        timeframes={['90d', '6m', '1y', '3y']}
        activeTimeframe={timeframe}
        setActiveTimeframe={setTimeframe}
      />
    </div>
  )
}
