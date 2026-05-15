'use client'

import { type FC, useMemo } from 'react'
import { Button, Card, Icon, Pill, Text } from '@summerfi/app-earn-ui'

import { formatNumber, formatPercent, formatUSD } from '@/features/dca/lib/format'
import { type DCAPositionSnapshot, type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAPositionViewProps {
  position: DCAPositionSnapshot
  pair?: DCAResolvedPair
  sourceSymbol?: string
  targetSymbol?: string
}

const Chart: FC<{ historyEvents: DCAPositionSnapshot['history']; targetSpotPrice: number }> = ({
  historyEvents,
  targetSpotPrice,
}) => {
  const filled = historyEvents.filter((entry) => entry.status === 'filled')

  if (filled.length === 0) return null

  const prices = filled.map((entry) => entry.price)
  const min = Math.min(...prices, targetSpotPrice) * 0.98
  const max = Math.max(...prices, targetSpotPrice) * 1.02
  const range = max - min || 1

  const width = 600
  const height = 180
  const padding = 16

  const points = filled
    .slice()
    .reverse()
    .map((entry, idx, arr) => {
      const x =
        padding + Number((idx / Math.max(arr.length - 1, 1)) * (width - Number(padding * 2)))
      const y =
        padding + Number((1 - Number((entry.price - min) / range)) * (height - Number(padding * 2)))

      return { x, y, entry }
    })

  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ')

  const totalDeployed = filled.reduce((sum, entry) => sum + entry.spent, 0)
  const totalAcquired = filled.reduce((sum, entry) => sum + entry.acquired, 0)
  const avgPrice = totalAcquired > 0 ? totalDeployed / totalAcquired : 0
  const avgY =
    padding + Number((1 - Number((avgPrice - min) / range)) * (height - Number(padding * 2)))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <line
        x1={padding}
        y1={avgY}
        x2={width - padding}
        y2={avgY}
        stroke="var(--earn-protocol-accent-100)"
        strokeDasharray="4 4"
        strokeWidth={1}
      />
      <polyline
        fill="none"
        stroke="var(--earn-protocol-success-100)"
        strokeWidth={2}
        points={polyline}
      />
      {points.map((point) => (
        <circle
          key={`${point.entry.tx}-${point.x}`}
          cx={point.x}
          cy={point.y}
          r={3}
          fill="var(--earn-protocol-success-100)"
        />
      ))}
    </svg>
  )
}

export const DCAPositionView: FC<DCAPositionViewProps> = ({
  position,
  pair,
  sourceSymbol = 'USDC',
  targetSymbol = 'ETH',
}) => {
  const fromSymbol = pair?.fromVault.inputToken.symbol ?? sourceSymbol
  const toSymbol = pair?.toVault.inputToken.symbol ?? targetSymbol

  const kpis = useMemo(
    () => [
      { label: 'Total deployed', value: formatUSD(position.totalDeployed, { decimals: 0 }) },
      {
        label: `${toSymbol} accumulated`,
        value: `${formatNumber(position.totalAcquired, 4)} ${toSymbol}`,
      },
      { label: 'Avg buy price', value: formatUSD(position.avgPrice, { decimals: 2 }) },
      { label: 'Current value', value: formatUSD(position.currentValue, { decimals: 0 }) },
      {
        label: 'Unrealized P&L',
        value: `${formatUSD(position.pnl, { decimals: 2, sign: true })} (${formatPercent(
          (position.pnl / Math.max(position.totalDeployed, 1)) * 100,
          2,
          true,
        )})`,
      },
    ],
    [position, toSymbol],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-24)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--general-space-16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-12)' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Icon tokenName={fromSymbol as never} size={36} />
            <span style={{ marginLeft: -8 }}>
              <Icon tokenName={toSymbol as never} size={36} />
            </span>
          </span>
          <div>
            <Text as="h1" variant="h3">
              DCA {fromSymbol} → {toSymbol}
            </Text>
            <Text as="p" variant="p3" style={{ opacity: 0.7 }}>
              Started {position.created} · Position #{position.id}
            </Text>
          </div>
          <Pill variant="default">
            <Text as="span" variant="p4semi">
              {position.status === 'active' ? 'Active' : 'Paused'}
            </Text>
          </Pill>
        </div>

        <div style={{ display: 'flex', gap: 'var(--general-space-8)' }}>
          <Button variant="secondaryMedium" style={{ minWidth: 'unset' }}>
            Pause
          </Button>
          <Button variant="secondaryMedium" style={{ minWidth: 'unset' }}>
            Edit
          </Button>
          <Button variant="secondaryMedium" style={{ minWidth: 'unset' }}>
            Close
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--general-space-12)',
        }}
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label} variant="cardPrimary">
            <div className={classNames.kpiCard}>
              <Text as="span" variant="p4" style={{ opacity: 0.7 }}>
                {kpi.label}
              </Text>
              <Text as="span" variant="p1semi">
                {kpi.value}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      <div className={classNames.layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
          <Card variant="cardPrimary">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-12)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text as="h3" variant="h5">
                  Cost basis vs price
                </Text>
                <Text as="span" variant="p4" style={{ opacity: 0.7 }}>
                  Spot: {formatUSD(position.targetSpotPrice, { decimals: 2 })}
                </Text>
              </div>
              <Chart historyEvents={position.history} targetSpotPrice={position.targetSpotPrice} />
            </div>
          </Card>

          <Card variant="cardPrimary">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-12)',
              }}
            >
              <Text as="h3" variant="h5">
                Execution history
              </Text>
              <div style={{ overflowX: 'auto' }}>
                <table className={classNames.historyTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Spent</th>
                      <th>Acquired</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {position.history.map((entry) => (
                      <tr key={`${entry.tx}-${entry.date}`}>
                        <td>{entry.date}</td>
                        <td>
                          {entry.spent > 0 ? `${formatNumber(entry.spent, 2)} ${fromSymbol}` : '—'}
                        </td>
                        <td>
                          {entry.acquired > 0
                            ? `${formatNumber(entry.acquired, 4)} ${toSymbol}`
                            : '—'}
                        </td>
                        <td>{formatUSD(entry.price, { decimals: 2 })}</td>
                        <td>
                          <Pill variant="default">
                            <Text as="span" variant="p4semi">
                              {entry.status === 'filled' ? 'Filled' : 'Skipped'}
                            </Text>
                          </Pill>
                          {entry.note ? (
                            <Text
                              as="span"
                              variant="p4"
                              style={{ display: 'block', opacity: 0.7, marginTop: 4 }}
                            >
                              {entry.note}
                            </Text>
                          ) : null}
                        </td>
                        <td>
                          <Text as="span" variant="p4" style={{ opacity: 0.7 }}>
                            {entry.tx}
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
          <Card variant="cardSecondary">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-8)',
              }}
            >
              <Text as="h4" variant="h5">
                Next execution
              </Text>
              <Text as="p" variant="p2semi">
                {position.nextRun}
              </Text>
            </div>
          </Card>

          <Card variant="cardSecondary">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-12)',
              }}
            >
              <Text as="h4" variant="h5">
                Strategy details
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Executions', value: position.executions },
                  { label: 'Skipped', value: position.skipped },
                  { label: 'From', value: fromSymbol },
                  { label: 'To', value: toSymbol },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'var(--general-space-8) 0',
                      borderBottom: '1px solid var(--earn-protocol-secondary-60)',
                    }}
                  >
                    <Text as="span" variant="p4" style={{ opacity: 0.7 }}>
                      {row.label}
                    </Text>
                    <Text as="span" variant="p3semi">
                      {row.value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
