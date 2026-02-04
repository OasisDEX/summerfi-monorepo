import type { FC } from 'react'
import { RechartResponsiveWrapper, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import {
  Pie,
  PieChart,
  type PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type TooltipContentProps,
} from 'recharts'

import { sumrOwnershipChartData } from '@/features/sumr-claim/components/SumrOwnership/config'

import classNames from './SumrOwnership.module.css'

interface LegendItemProps {
  label: string
  backgroundColor: string
  value: string | number
  valueRaw: string | number
  asTooltip?: boolean
}

const LegendItem: FC<LegendItemProps> = ({
  label,
  backgroundColor,
  value,
  valueRaw,
  asTooltip,
}) => {
  return asTooltip ? (
    <div className={classNames.legendItemWrapper}>
      <div className={classNames.textualWrapper}>
        <Text as="p" variant="p3semi" className={classNames.legendItemText}>
          {label}
        </Text>
        <Text as="span" variant="p3semiColorful" className={classNames.legendItemValue}>
          {formatDecimalAsPercent(value)}{' '}
        </Text>
        <Text
          as="span"
          variant="p3"
          style={{ color: 'var(--earn-protocol-secondary-60) !important', fontWeight: 400 }}
        >
          &#8226; {formatCryptoBalance(valueRaw)}
        </Text>
      </div>
    </div>
  ) : (
    <div className={classNames.legendItemWrapper}>
      <div className={classNames.dotAndTextWrapper}>
        <div className={classNames.dot} style={{ backgroundColor }} />
        <div className={classNames.textualWrapper}>
          <Text as="p" variant="p3semi" className={classNames.legendItemText}>
            {label}
          </Text>
          <Text as="p" variant="p3" className={classNames.legendItemValue}>
            {formatCryptoBalance(valueRaw)}
          </Text>
        </div>
      </div>
      <Text as="p" variant="p3semiColorful">
        {formatDecimalAsPercent(value)}
      </Text>
    </div>
  )
}

const CustomTooltip = ({ active, payload }: TooltipContentProps<string, string>) => {
  if (
    active &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    payload?.length &&
    payload[0].name &&
    payload[0].value &&
    payload[0].payload.valueRaw
  ) {
    return (
      <div className={classNames.customTooltipWrapper}>
        <LegendItem
          label={payload[0].name}
          backgroundColor={payload[0].payload.fill}
          value={payload[0].value}
          valueRaw={payload[0].payload.valueRaw}
          asTooltip
        />
      </div>
    )
  }

  return null
}

const CustomPieShape = ({ fill }: PieSectorShapeProps) => {
  return <Sector fill={fill} stroke="unset" style={{ outline: 'none', cursor: 'pointer' }} />
}

export const SumrOwnership = () => {
  const data = sumrOwnershipChartData

  return (
    <div className={classNames.sumrOwnershipWrapper}>
      <div className={classNames.chartSection}>
        <div className={classNames.customChartWrapper}>
          <RechartResponsiveWrapper height="265px">
            <ResponsiveContainer width="100%" height="100%">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart width={265} height={265}>
                  <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={132}
                    shape={CustomPieShape}
                  />
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </div>
            </ResponsiveContainer>
          </RechartResponsiveWrapper>
        </div>
        <div className={classNames.chartLegendWrapper}>
          {data.map((item) => (
            <LegendItem
              key={item.name}
              label={item.name}
              backgroundColor={item.fill}
              value={item.value}
              valueRaw={item.valueRaw}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
