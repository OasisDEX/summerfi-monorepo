import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import classNames from './YieldsLegend.module.css'

type YieldsLegendProps = {
  dataNames: string[]
  colors: { [key: string]: string }
  highlightedProtocol?: string
  onMouseEnter: (dataKey: string) => void
  onMouseLeave: () => void
}

export const YieldsLegend: FC<YieldsLegendProps> = ({
  dataNames,
  colors,
  highlightedProtocol,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div className={classNames.legendWrapper}>
      {dataNames.map((dataName) => (
        <div
          key={dataName}
          className={classNames.legendItem}
          onMouseEnter={() => onMouseEnter(dataName)}
          onMouseLeave={onMouseLeave}
          style={{
            opacity: highlightedProtocol && highlightedProtocol !== dataName ? 0.1 : 1,
          }}
        >
          <div
            className={classNames.dot}
            style={{
              backgroundColor: colors[dataName],
              border:
                highlightedProtocol === dataName ? '2px solid var(--color-text-primary)' : 'none',
            }}
          />
          <Text
            as="p"
            variant="p3"
            className={classNames.legendItemText}
            style={{ color: colors[dataName] }}
          >
            {dataName}
          </Text>
        </div>
      ))}
    </div>
  )
}
