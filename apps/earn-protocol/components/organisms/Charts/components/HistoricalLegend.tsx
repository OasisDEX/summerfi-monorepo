import { type FC, type ReactNode } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { historicalPerformanceLabelMap } from '@/components/organisms/Charts/labels'

import historicalLegendStyles from './HistoricalLegend.module.css'

type HistoricalLegendProps = {
  tokenSymbol: TokenSymbolsList
  highlightedData: {
    [key in keyof typeof historicalPerformanceLabelMap]: string | number
  }
  isMobile: boolean
}

const LegendBlock = ({
  color,
  title,
  value,
}: {
  color: string
  title: string
  value: ReactNode
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
      <Text variant="p3semi" style={{ color: 'rgb(119, 117, 118)' }}>
        {title}
      </Text>
    </div>
    <div className={historicalLegendStyles.historicalLegendItemValue}>{value}</div>
  </div>
)

export const HistoricalLegend: FC<HistoricalLegendProps> = ({
  tokenSymbol,
  highlightedData,
  isMobile,
}) => {
  return (
    <div
      className={historicalLegendStyles.historicalLegendWrapper}
      style={{
        textAlign: isMobile ? 'center' : 'right',
        marginTop: isMobile ? 'var(--general-space-32)' : '0',
      }}
    >
      <LegendBlock
        color="#FF80BF"
        title={historicalPerformanceLabelMap.netValue}
        value={
          <>
            <Icon tokenName={tokenSymbol} size={20} />
            <Text as="span" variant="p1semi">
              {highlightedData.netValue}
            </Text>
          </>
        }
      />
      <LegendBlock
        color="#FF49A4"
        title={historicalPerformanceLabelMap.depositedValue}
        value={
          <>
            <Icon tokenName={tokenSymbol} size={20} />
            <Text as="span" variant="p1semi">
              {highlightedData.depositedValue}
            </Text>
          </>
        }
      />
      <LegendBlock
        color="var(--color-background-interactive-disabled)"
        title={historicalPerformanceLabelMap.earnings}
        value={
          <>
            <Icon tokenName={tokenSymbol} size={20} />
            <Text as="span" variant="p1semi">
              {highlightedData.earnings}
            </Text>
          </>
        }
      />
      <LegendBlock
        color="white"
        title={historicalPerformanceLabelMap.sumrEarned}
        value={
          <>
            <Icon tokenName="SUMR" size={20} />
            <Text as="span" variant="p1semi">
              {highlightedData.sumrEarned}
            </Text>
          </>
        }
      />
    </div>
  )
}
