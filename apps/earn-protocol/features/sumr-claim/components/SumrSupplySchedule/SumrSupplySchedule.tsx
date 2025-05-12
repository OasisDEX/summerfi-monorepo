import { Card, RechartResponsiveWrapper, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  Area,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import {
  sumrSupplyScheduleColors,
  sumrSupplyScheduleData,
  sumrSupplyScheduleDataNames,
} from './config'

import classNames from './SumrSupplySchedule.module.css'

const Legend = () => {
  return (
    <div className={classNames.sumrSupplyScheduleLegend}>
      {sumrSupplyScheduleDataNames.map((dataName) => (
        <div className={classNames.legendItem} key={dataName}>
          <div
            className={classNames.dot}
            style={{
              backgroundColor:
                sumrSupplyScheduleColors[
                  `${dataName}-color` as keyof typeof sumrSupplyScheduleColors
                ],
            }}
          ></div>
          <Text as="p" variant="p4semi">
            {dataName}
          </Text>
        </div>
      ))}

      <div className={classNames.legendItem}>
        <div className={classNames.dashedLineHorizontal} />
        <Text as="p" variant="p4semi">
          Long Term Supply Cap
        </Text>
      </div>
      <div className={classNames.legendItem}>
        <div className={classNames.dashedLineVertical} />
        <Text as="p" variant="p4semi">
          Earliest Transferability Point
        </Text>
      </div>
    </div>
  )
}

export const SumrSupplySchedule = () => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  return (
    <>
      <Card
        style={{
          backgroundColor: 'var(--earn-protocol-neutral-100)',
          padding: 'var(--general-space-16) var(--general-space-20)',
          flexDirection: 'column',
        }}
      >
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            paddingTop: 'var(--general-space-8)',
          }}
        >
          Circulating Supply
        </Text>
        <RechartResponsiveWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={sumrSupplyScheduleData}
              margin={{
                top: 50,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" fontSize={12} interval={isMobile ? 16 : 5} tickMargin={10} />
              <YAxis
                strokeWidth={0}
                width={55}
                tickFormatter={(label: string) =>
                  `${formatCryptoBalance(label).replace('.00', '')}`
                }
              />
              <Tooltip
                formatter={(val) => `${formatCryptoBalance(Number(val)).replace('.00', '')}`}
                useTranslate3d
                allowEscapeViewBox={{
                  x: false,
                  y: false,
                }}
                contentStyle={{
                  zIndex: 1000,
                  backgroundColor: 'var(--color-surface-subtler)',
                  borderRadius: '5px',
                  padding: '20px 30px',
                  border: 'none',
                  maxWidth: isMobile ? '350px' : 'unset',
                  whiteSpace: isMobile ? 'unset' : 'nowrap',
                }}
              />

              {sumrSupplyScheduleDataNames.map((dataName, dataIndex) => (
                <Area
                  stackId={1}
                  key={dataName}
                  type="natural"
                  animationDuration={300}
                  animationBegin={dataIndex * 50}
                  animationEasing="ease-out"
                  dataKey={dataName}
                  strokeWidth={1}
                  stroke={
                    sumrSupplyScheduleColors[
                      `${dataName}-color` as keyof typeof sumrSupplyScheduleColors
                    ]
                  }
                  fillOpacity={0.5}
                  fill={
                    sumrSupplyScheduleColors[
                      `${dataName}-color` as keyof typeof sumrSupplyScheduleColors
                    ]
                  }
                />
              ))}

              <ReferenceLine x="01/07/25" stroke="#777576" strokeDasharray="5 6" />
              <ReferenceLine y={1000000000} stroke="#FFFBFD" strokeDasharray="5 10" />
            </ComposedChart>
          </ResponsiveContainer>
        </RechartResponsiveWrapper>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            paddingTop: 'var(--general-space-16)',
            textAlign: 'center',
          }}
        >
          Time After Launch (Months)
        </Text>
      </Card>
      <Legend />
    </>
  )
}
