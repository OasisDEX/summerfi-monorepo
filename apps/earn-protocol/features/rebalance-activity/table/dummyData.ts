import type { RebalancingActivityRawData } from '@/features/rebalance-activity/table/types'

export const rebalancingActivityRawData: RebalancingActivityRawData[] = [
  {
    type: 'reduce',
    action: {
      from: 'USDC',
      to: 'DAI',
    },
    amount: {
      token: 'USDC',
      value: '123123',
    },
    strategy: 'USDC Ethereum Lower Risk',
    timestamp: '12321321',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
  {
    type: 'increase',
    action: {
      from: 'USDT',
      to: 'USDC',
    },
    amount: {
      token: 'USDT',
      value: '123123',
    },
    strategy: 'USDC Ethereum Lower Risk',
    timestamp: '1727385013506',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
  {
    type: 'increase',
    action: {
      from: 'DAI',
      to: 'USDC',
    },
    amount: {
      token: 'DAI',
      value: '123123',
    },
    strategy: 'USDC Ethereum Lower Risk',
    timestamp: '1727385013506',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
]
