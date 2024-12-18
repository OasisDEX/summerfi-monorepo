import { type ReactNode } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { DefaultLegendContent, type LegendProps } from 'recharts'

import historicalLegendStyles from './HistoricalLegend.module.scss'

const historicalLegendLabelMap: {
  [key: string]: string
} = {
  forecast: 'Forecast Market Value',
  netValue: 'Market Value',
  depositedValue: 'Net Contributions',
  earnings: 'Earnings to Date',
  sumrEarned: '$SUMR Earned',
}

type HistoricalLegendProps = LegendProps & {
  tokenSymbol: TokenSymbolsList
  highlightedData: {
    [key in keyof typeof historicalLegendLabelMap]: string | number
  }
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

export const HistoricalLegend = ({
  payload,
  ref: _ref,
  tokenSymbol,
  highlightedData,
  ...rest
}: HistoricalLegendProps) => {
  const emptyLegendIcon = <circle cx="0" cy="0" r="0" fill="transparent" />
  const earningsBlock = {
    legendIcon: emptyLegendIcon,
    value: (
      <LegendBlock
        color="var(--color-background-interactive-disabled)"
        title={historicalLegendLabelMap.earnings}
        value={
          <>
            <Icon tokenName={tokenSymbol} size={20} />
            <Text variant="p1semi">{highlightedData.earnings}</Text>
          </>
        }
      />
    ),
  }
  const sumrEarnedBlock = {
    legendIcon: emptyLegendIcon,
    value: (
      <LegendBlock
        color="white"
        title={historicalLegendLabelMap.sumrEarned}
        value={
          <>
            <Icon tokenName="SUMR" size={20} />
            <Text variant="p1semi">{highlightedData.sumrEarned}</Text>
          </>
        }
      />
    ),
  }
  const nextPayload = [
    ...(payload?.map(({ dataKey, inactive: _inactive, ...entry }) => ({
      ...entry,
      legendIcon: emptyLegendIcon,
      value: (
        <LegendBlock
          color={entry.color as string}
          title={historicalLegendLabelMap[entry.value as string] ?? entry.value}
          value={
            <>
              <Icon tokenName={tokenSymbol} size={20} />
              <Text variant="p1semi">
                {highlightedData[dataKey as keyof typeof highlightedData] ?? entry.value}
              </Text>
            </>
          }
        />
      ),
    })) ?? []),
    earningsBlock,
    sumrEarnedBlock,
  ]

  return (
    <div className={historicalLegendStyles.historicalLegendWrapper}>
      <DefaultLegendContent payload={nextPayload} {...rest} />
    </div>
  )
}
