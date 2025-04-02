import { Text, Timeframes, ToggleButton } from '@summerfi/app-earn-ui'
import { type TimeframesItem, type TimeframesType } from '@summerfi/app-types'

import classNames from './ChartHeader.module.scss'

type ChartHeaderProps = {
  title?: string
  checkboxLabel?: string
  checkboxValue?: boolean
  setCheckboxValue?: (value: boolean) => void
  timeframe?: TimeframesType
  timeframes: TimeframesItem
  setTimeframe?: (timeframe: string) => void
  wrapperStyle?: React.CSSProperties
}

export const ChartHeader = ({
  title,
  checkboxLabel,
  checkboxValue = false,
  timeframe,
  setCheckboxValue,
  setTimeframe,
  timeframes,
  wrapperStyle,
}: ChartHeaderProps) => {
  return (
    <div className={classNames.wrapper} style={wrapperStyle}>
      {title && <Text variant="p2semi">{title}</Text>}
      {setCheckboxValue && checkboxLabel && (
        <ToggleButton
          checked={checkboxValue}
          title={checkboxLabel}
          onChange={() => setCheckboxValue(!checkboxValue)}
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
