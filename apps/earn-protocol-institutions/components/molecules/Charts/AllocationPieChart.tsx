'use client'

import { Card, Text } from '@summerfi/app-earn-ui'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { formatChartPercentageValue } from '@/features/charts/helpers'
import { type AllocationItem } from '@/features/panels/vaults/components/PanelVaultExposure/get-arks-allocation'

type NavPriceChartProps = {
  chartData?: AllocationItem[]
}
const parseAllocationItemToChartData = (item: AllocationItem) => ({
  name: item.label,
  value: item.percentage * 100,
  fill: item.color,
})

export const AllocationPieChart = ({ chartData }: NavPriceChartProps) => {
  const parsedChartData = chartData?.map(parseAllocationItemToChartData) ?? []

  if (parsedChartData.length === 0) {
    return (
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 400,
          }}
        >
          <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
            No allocation data
          </Text>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart responsive>
          <Pie data={parsedChartData} dataKey="value" cx="50%" cy="50%" stroke="0" />
          <Tooltip
            formatter={(val, valName) => {
              return [formatChartPercentageValue(Number(val)), String(valName)]
            }}
            wrapperStyle={{
              color: 'var(--color-text-primary)',
              zIndex: 1000,
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: '5px',
              padding: '10px',
            }}
            labelStyle={{
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              fontWeight: '700',
              marginTop: '10px',
              marginBottom: '10px',
            }}
            contentStyle={{
              color: 'var(--color-text-primary)',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '13px',
              lineHeight: '11px',
              letterSpacing: '-0.5px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
