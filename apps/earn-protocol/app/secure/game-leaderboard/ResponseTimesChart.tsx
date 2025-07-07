'use client'

import { type JsonValue } from '@summerfi/summer-protocol-db'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

export function ResponseTimesChart({ responseTimes }: { responseTimes?: JsonValue }) {
  const data = (responseTimes ?? []) as number[]

  return (
    <div style={{ width: '250px', height: '50px', padding: '0 10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((y, index) => ({ x: index, y }))}>
          <Line type="monotone" dataKey="y" dot strokeWidth={2} animationDuration={100} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
