import { type TokenSymbolsList } from '@summerfi/app-types'

export interface RebalancingActivityRawData {
  type: string
  action: { from: TokenSymbolsList; to: TokenSymbolsList }
  amount: { token: TokenSymbolsList; value: string }
  strategy: string
  timestamp: string
  provider: {
    link: string
    label: string
  }
}
