import { useMemo, useState } from 'react'
import { random } from 'lodash-es'
import {
  Area,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const dataNames = [
  'Median Defi Yield',
  'Median Aave Lending',
  'Median Morpho Lending',
  'Median USDS',
  'Summer USDS Strategy',
]

const colors = {
  'Median Defi Yield-color': '#777576',
  'Median Aave Lending-color': '#B6509E',
  'Median Morpho Lending-color': '#5786FE',
  'Median USDS-color': '#D8762D',
  'Summer USDS Strategy-color': '#FF49A4',
}

const data = [
  {
    name: 'Jun 2024',
    'Median Defi Yield': random(0, 1, true),
    'Median Aave Lending': random(0, 1, true),
    'Median Morpho Lending': random(0, 1, true),
    'Median USDS': random(0, 1, true),
    'Summer USDS Strategy': random(0, 2, true),
  },
  {
    name: 'Jul 2024',
    'Median Defi Yield': random(0, 3, true),
    'Median Aave Lending': random(0, 3, true),
    'Median Morpho Lending': random(0, 3, true),
    'Median USDS': random(0, 3, true),
    'Summer USDS Strategy': random(1, 3, true),
  },
  {
    name: 'Aug 2024',
    'Median Defi Yield': random(1, 7, true),
    'Median Aave Lending': random(1, 7, true),
    'Median Morpho Lending': random(1, 7, true),
    'Median USDS': random(1, 7, true),
    'Summer USDS Strategy': random(1, 7, true),
  },
  {
    name: 'Sep 2024',
    'Median Defi Yield': random(2, 9, true),
    'Median Aave Lending': random(2, 9, true),
    'Median Morpho Lending': random(2, 9, true),
    'Median USDS': random(2, 9, true),
    'Summer USDS Strategy': random(6, 14, true),
  },
  {
    name: 'Oct 2024',
    'Median Defi Yield': random(1, 8, true),
    'Median Aave Lending': random(1, 8, true),
    'Median Morpho Lending': random(1, 8, true),
    'Median USDS': random(1, 8, true),
    'Summer USDS Strategy': random(7, 15, true),
  },
  {
    name: 'Nov 2024',
    'Median Defi Yield': random(1, 8, true),
    'Median Aave Lending': random(1, 8, true),
    'Median Morpho Lending': random(1, 8, true),
    'Median USDS': random(1, 8, true),
    'Summer USDS Strategy': random(7, 15, true),
  },
  {
    name: 'Dec 2024',
    'Median Defi Yield': random(3, 12, true),
    'Median Aave Lending': random(3, 12, true),
    'Median Morpho Lending': random(3, 12, true),
    'Median USDS': random(3, 12, true),
    'Summer USDS Strategy': random(7, 15, true),
  },
]

export const MockedLineChart = () => {
  const [compare, setCompare] = useState(true)

  const dataNamesParsed = useMemo(() => {
    if (compare) {
      return dataNames
    }

    return dataNames
  }, [compare])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
        <label htmlFor="compare" style={{ marginTop: 6 }}>
          Compare to others
        </label>
        <input
          type="checkbox"
          id="compare"
          name="compare"
          checked={compare}
          onChange={() => setCompare(!compare)}
          style={{
            margin: 10,
            width: 20,
            height: 20,
          }}
        />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={data}
          margin={{
            top: 50,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="summerYieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF49A4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#333333" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" fontSize={12} interval={0} />
          <YAxis strokeWidth={0} tickFormatter={(label: string) => `${label}%`} />
          <Tooltip
            formatter={(val) => `${Number(val).toFixed(2)}`}
            useTranslate3d
            contentStyle={{
              zIndex: 1000,
              backgroundColor: 'var(--color-surface-subtler)',
              borderRadius: '5px',
              padding: '20px 30px',
              border: 'none',
            }}
          />
          {dataNamesParsed.map((dataName, dataIndex) =>
            dataName === 'Summer USDS Strategy' ? (
              <Area
                key={dataName}
                type="natural"
                animationDuration={400}
                animationBegin={dataIndex * 100}
                dataKey={dataName}
                strokeWidth={1}
                stroke={colors[`${dataName}-color` as keyof typeof colors]}
                fillOpacity={1}
                fill="url(#summerYieldGradient)"
              />
            ) : (
              <Line
                hide={!compare}
                animationId={dataIndex}
                key={dataName}
                animationDuration={400}
                animationBegin={dataIndex * 100}
                type="natural"
                dataKey={dataName}
                strokeDasharray="3 3"
                stroke={colors[`${dataName}-color` as keyof typeof colors]}
                strokeWidth={1}
                dot={false}
                connectNulls
              />
            ),
          )}
          <Legend iconType="circle" iconSize={8} align="center" layout="horizontal" height={60} />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}
