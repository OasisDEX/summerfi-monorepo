'use client'

import { Tooltip } from '@summerfi/app-earn-ui'

import { type GameEntry, type SacScore } from './types'

export const AntiCheatScore = ({ sacScore, entry }: { sacScore: SacScore; entry: GameEntry }) => {
  return (
    <div>
      <Tooltip
        tooltip={
          <div>
            <strong>Summer Anti Cheat Score:</strong>
            <p>{sacScore.explanation}</p>
            {sacScore.mean && (
              <p>
                Mean: {sacScore.mean} ms, StdDev: {sacScore.stdDev} ms
              </p>
            )}
          </div>
        }
        style={{
          display: 'inline-block',
        }}
        tooltipWrapperStyles={{
          width: '300px',
        }}
      >
        <span
          style={{
            color: sacScore.score < 50 ? 'red' : 'inherit',
            fontWeight: sacScore.score < 50 ? 'bold' : 'normal',
          }}
        >
          {sacScore.score}
        </span>
      </Tooltip>
      <br />
      <span style={{ fontSize: '0.8em', color: '#666' }}>
        {((entry.responseTimes ?? []) as number[] | undefined)?.length ?? 'n/a'} rounds
      </span>
    </div>
  )
}
