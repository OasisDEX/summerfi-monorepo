import { type TokenSymbolsList } from '@summerfi/app-types'

export const yieldSourcesChartData = [
  { name: 'Liquidity Pools', value: 0.35, fill: 'var(--earn-protocol-primary-100)' },
  { name: 'Basis Trading', value: 0.3, fill: 'var(--earn-protocol-primary-40)' },
  { name: 'Isolated Lending', value: 0.35, fill: 'var(--earn-protocol-primary-70)' },
]

export interface YieldSourcesRawData {
  vault: {
    label: string
    href: string
  }
  allocation: string
  protocol: {
    label: string
    icon: TokenSymbolsList
  }
  protocolNetDeposits: string
  longevity: string
}

export const yieldSourcesTableRawData: YieldSourcesRawData[] = [
  {
    vault: {
      label: 'Uniswap V3 WETH/USDC',
      href: '',
    },
    allocation: '0.15',
    protocol: {
      label: 'Uniswap',
      icon: 'UNI',
    },
    protocolNetDeposits: '7300000',
    longevity: '1231323113',
  },
]
