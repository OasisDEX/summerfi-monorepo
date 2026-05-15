import { type DCAPositionSnapshot } from './types'

/**
 * Mock position payload used by the position dashboard while the
 * subgraph / API isn't wired up yet. See plan.md §4 for the work items
 * needed to replace this with real data.
 */
export const buildMockPosition = (id: string): DCAPositionSnapshot => {
  const targetSpotPrice = 3284.41
  const historyEvents: DCAPositionSnapshot['history'] = [
    {
      date: 'May 06, 2026 · 09:00',
      spent: 250,
      acquired: 0.0758,
      price: 3299.21,
      status: 'filled',
      tx: '0x4a91…e2c1',
    },
    {
      date: 'May 05, 2026 · 09:00',
      spent: 250,
      acquired: 0.0762,
      price: 3281.19,
      status: 'filled',
      tx: '0x8b22…7711',
    },
    {
      date: 'May 04, 2026 · 09:00',
      spent: 250,
      acquired: 0.0759,
      price: 3294.42,
      status: 'filled',
      tx: '0x1ca0…9d44',
    },
    {
      date: 'May 03, 2026 · 09:00',
      spent: 0,
      acquired: 0,
      price: 3412.05,
      status: 'skipped',
      tx: '—',
      note: 'Above price ceiling',
    },
    {
      date: 'May 02, 2026 · 09:00',
      spent: 250,
      acquired: 0.0743,
      price: 3365.1,
      status: 'filled',
      tx: '0xd9f3…4c2a',
    },
    {
      date: 'May 01, 2026 · 09:00',
      spent: 250,
      acquired: 0.0751,
      price: 3327.88,
      status: 'filled',
      tx: '0x55e1…8a09',
    },
    {
      date: 'Apr 30, 2026 · 09:00',
      spent: 250,
      acquired: 0.0754,
      price: 3315.42,
      status: 'filled',
      tx: '0x0727…b6dd',
    },
  ]

  const filled = historyEvents.filter((entry) => entry.status === 'filled')
  const totalDeployed = filled.reduce((sum, entry) => sum + entry.spent, 0)
  const totalAcquired = filled.reduce((sum, entry) => sum + entry.acquired, 0)
  const avgPrice = totalAcquired > 0 ? totalDeployed / totalAcquired : 0
  const currentValue = totalAcquired * targetSpotPrice

  return {
    id,
    created: 'Apr 27, 2026',
    totalDeployed,
    totalAcquired,
    avgPrice,
    currentValue,
    pnl: currentValue - totalDeployed,
    executions: filled.length,
    skipped: historyEvents.length - filled.length,
    nextRun: 'May 07, 2026 · 09:00 UTC',
    status: 'active',
    history: historyEvents,
    targetSpotPrice,
  }
}
