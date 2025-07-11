import { Button, Text, Timeframes, ToggleButton } from '@summerfi/app-earn-ui'
import { type TimeframesItem, type TimeframesType } from '@summerfi/app-types'

import classNames from './ChartHeader.module.css'

type ChartHeaderProps = {
  title?: string
  checkboxLabel?: string
  checkboxValue?: boolean
  setCheckboxValue?: (value: boolean) => void
  timeframe?: TimeframesType
  timeframes: TimeframesItem
  setTimeframe?: (timeframe: string) => void
  wrapperStyle?: React.CSSProperties
  isZoomed?: boolean
  onResetZoom?: () => void
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
  isZoomed = false,
  onResetZoom,
}: ChartHeaderProps) => {
  return (
    <div className={classNames.wrapper} style={wrapperStyle}>
      {title && <Text variant="p2semi">{title}</Text>}
      {setCheckboxValue && checkboxLabel ? (
        <ToggleButton
          checked={checkboxValue}
          title={checkboxLabel}
          onChange={() => setCheckboxValue(!checkboxValue)}
        />
      ) : (
        <div />
      )}
      {isZoomed ? (
        <Button onClick={onResetZoom} variant="neutralSmall" style={{ height: '24px' }}>
          Reset Zoom
        </Button>
      ) : (
        timeframe &&
        setTimeframe && (
          <Timeframes
            timeframes={timeframes}
            activeTimeframe={timeframe}
            setActiveTimeframe={setTimeframe}
          />
        )
      )}
    </div>
  )
}
