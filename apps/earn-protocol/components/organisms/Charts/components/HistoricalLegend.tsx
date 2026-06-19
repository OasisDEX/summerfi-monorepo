import { type FC, type ReactNode } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { historicalPerformanceLabelMap } from '@/components/organisms/Charts/labels'

import historicalLegendStyles from './HistoricalLegend.module.css'

// The legend items the HistoricalChart can show. Order here is the display order.
export type HistoricalLegendItemKey = 'netValue' | 'depositedValue' | 'earnings' | 'sumrEarned'

export type HistoricalLegendData = {
  [key in HistoricalLegendItemKey]: string | number
}

// Per-item descriptors: dot color + which icon to show (the position's input token, or SUMR). Titles
// come from the shared historicalPerformanceLabelMap.
const legendItemsConfig: { key: HistoricalLegendItemKey; color: string; icon: 'token' | 'sumr' }[] =
  [
    { key: 'netValue', color: '#FF80BF', icon: 'token' },
    { key: 'depositedValue', color: '#FF49A4', icon: 'token' },
    { key: 'earnings', color: 'var(--color-background-interactive-disabled)', icon: 'token' },
    { key: 'sumrEarned', color: 'white', icon: 'sumr' },
  ]

type HistoricalLegendProps = {
  tokenSymbol: TokenSymbolsList
  highlightedData: HistoricalLegendData
  isMobile: boolean
  // Subset of items to render (display order stays fixed by the config). Defaults to all.
  legendItems?: HistoricalLegendItemKey[]
  // Rendered inside the chart tooltip instead of the right sidebar — left-aligned, no sidebar margins.
  inTooltip?: boolean
}

const LegendBlock = ({
  color,
  title,
  value,
  titleVariant,
}: {
  color: string
  title: string
  value: ReactNode
  titleVariant: 'p3semi' | 'p4semi'
}) => (
  <div className={historicalLegendStyles.historicalLegendItemWrapper}>
    <div className={historicalLegendStyles.historicalLegendItemTitle}>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="5" cy="5" r="5" fill={color} />
      </svg>
      <Text variant={titleVariant} style={{ color: 'rgb(119, 117, 118)' }}>
        {title}
      </Text>
    </div>
    <div
      className={historicalLegendStyles.historicalLegendItemValue}
      data-testid="historical-legend-item-value"
    >
      {value}
    </div>
  </div>
)

export const HistoricalLegend: FC<HistoricalLegendProps> = ({
  tokenSymbol,
  highlightedData,
  isMobile,
  legendItems,
  inTooltip = false,
}) => {
  const visibleItems = legendItemsConfig.filter(
    (item) => !legendItems || legendItems.includes(item.key),
  )

  // The in-tooltip variant uses smaller text + icons so it reads like the chart's other tooltips,
  // not the large right-sidebar legend.
  const titleVariant = inTooltip ? 'p4semi' : 'p3semi'
  const valueVariant = inTooltip ? 'p3semi' : 'p1semi'
  const iconSize = inTooltip ? 16 : 20

  return (
    <div
      className={historicalLegendStyles.historicalLegendWrapper}
      style={
        inTooltip
          ? // Override the sidebar layout (the desktop CSS adds a 40px left margin + 190px min-width)
            // so the legend sits compact and left-aligned inside the tooltip card.
            { textAlign: 'left', marginLeft: 0, minWidth: 'auto' }
          : {
              textAlign: isMobile ? 'center' : 'right',
              marginTop: isMobile ? 'var(--general-space-32)' : '0',
            }
      }
    >
      {visibleItems.map((item) => (
        <LegendBlock
          key={item.key}
          color={item.color}
          title={historicalPerformanceLabelMap[item.key]}
          titleVariant={titleVariant}
          value={
            <>
              <Icon tokenName={item.icon === 'sumr' ? 'SUMR' : tokenSymbol} size={iconSize} />
              <Text as="span" variant={valueVariant}>
                {highlightedData[item.key]}
              </Text>
            </>
          }
        />
      ))}
    </div>
  )
}
