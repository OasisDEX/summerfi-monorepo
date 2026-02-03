'use client'

import { type JsonValue } from '@summerfi/summer-protocol-db'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

export function ResponseTimesChart({ responseTimes }: { responseTimes?: JsonValue }) {
  const data = (responseTimes ?? []) as number[]

  return (
    <div style={{ width: '250px', height: '50px', padding: '0 10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((y, index) => ({ x: index, y: Number(y) }))}>
          <Line type="monotone" dataKey="y" dot strokeWidth={2} animationDuration={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#000',
              border: '1px solid #ccc',
              padding: '5px 10px',
              borderRadius: '10px',
            }}
            itemStyle={{ display: 'none' }}
            cursor={false}
            labelFormatter={(label, test) =>
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              `Response Time: ${test[0] ? `${Number(Number(test[0].value).toFixed(2)) * 1000}` : 'n/a'} ms`
            }
            allowEscapeViewBox={{
              x: true,
              y: true,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
