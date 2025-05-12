import { type FC, useMemo } from 'react'
import { Card, RechartResponsiveWrapper, Table, Text } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, type TooltipProps } from 'recharts'

import { yieldSourcesColumns } from '@/features/vault-details/components/VaultDetailsYieldSources/columns'
import {
  yieldSourcesChartData,
  yieldSourcesTableRawData,
} from '@/features/vault-details/components/VaultDetailsYieldSources/config'
import { yieldSourcesMapper } from '@/features/vault-details/components/VaultDetailsYieldSources/mapper'

import classNames from './VaultDetailsYieldSources.module.css'

interface LegendItemProps {
  label: string
  backgroundColor: string
  value: string | number
}

const LegendItem: FC<LegendItemProps> = ({ label, backgroundColor, value }) => {
  return (
    <div className={classNames.legendItemWrapper}>
      <div className={classNames.dot} style={{ backgroundColor }} />
      <Text as="p" variant="p3" className={classNames.legendItemText}>
        {label}
      </Text>
      <Text as="p" variant="p3semi">
        {formatDecimalAsPercent(value)}
      </Text>
    </div>
  )
}

const CustomTooltip: FC<TooltipProps<string, string>> = ({ active, payload }) => {
  if (active && payload?.length && payload[0].name && payload[0].value) {
    return (
      <div className={classNames.customTooltipWrapper}>
        <LegendItem
          label={payload[0].name}
          backgroundColor={payload[0].payload.fill}
          value={payload[0].value}
        />
      </div>
    )
  }

  return null
}

export const VaultDetailsYieldSources = () => {
  const data = yieldSourcesChartData

  const tableData = useMemo(() => yieldSourcesMapper(yieldSourcesTableRawData), [])

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="p" variant="p2semi">
        Sources of USDC Vault Yield
      </Text>
      <div className={classNames.chartSection}>
        <RechartResponsiveWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart width={390} height={390}>
                <Pie
                  dataKey="value"
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={97}
                  outerRadius={195}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="unset"
                      style={{ outline: 'none', cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
          </ResponsiveContainer>
        </RechartResponsiveWrapper>
        <div className={classNames.chartLegendWrapper}>
          {data.map((item) => (
            <LegendItem
              key={item.name}
              label={item.name}
              backgroundColor={item.fill}
              value={item.value}
            />
          ))}
        </div>
      </div>
      <Text as="p" variant="p2semi" className={classNames.headings}>
        What are liquidity pools?
      </Text>
      <Text
        as="p"
        variant="p3"
        className={classNames.description}
        style={{ marginBottom: 'var(--general-space-24)' }}
      >
        Liquidity pools in DeFi are pools of tokens locked in smart contracts, allowing users to
        trade, lend, or borrow assets without a traditional intermediary. Users (liquidity
        providers) contribute tokens to these pools and earn fees or rewards in return.
      </Text>
      <Text
        as="p"
        variant="p3"
        className={classNames.description}
        style={{ marginBottom: 'var(--general-space-40)' }}
      >
        They enable decentralized exchanges (DEXs) like Uniswap to function, where automated market
        makers (AMMs) determine the price of assets based on the pool&apos;s supply.
      </Text>
      <Text as="p" variant="p2semi" className={classNames.headings}>
        Where does the yield come from?
      </Text>
      <Text
        as="p"
        variant="p3"
        className={classNames.description}
        style={{ marginBottom: 'var(--general-space-24)' }}
      >
        In liquidity pools, yield comes from trading fees.
      </Text>
      <Text
        as="p"
        variant="p3"
        className={classNames.description}
        style={{ marginBottom: 'var(--general-space-40)' }}
      >
        When people swap tokens in the pool, they pay a small fee. If you add your tokens to the
        pool, you get a share of those fees as a reward.
      </Text>
      <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--general-space-8)' }}>
        Liquidity Pools we use in this vault
      </Text>
      <Table rows={tableData} columns={yieldSourcesColumns} />
    </Card>
  )
}
