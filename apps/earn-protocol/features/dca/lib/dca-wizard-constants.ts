import { NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

export const STABLE_TOKEN_SYMBOLS = ['USDC', 'USDT'] as const
export const ETH_TOKEN_SYMBOLS = ['ETH', 'WETH'] as const

export const DEFAULT_NETWORK = NetworkNames.ethereumMainnet
export const DEFAULT_SDK_NETWORK = supportedSDKNetwork(networkNameToSDKNetwork(DEFAULT_NETWORK))

export type FrequencyOptionId = 'custom' | 'daily' | 'weekly' | 'monthly'

export interface FrequencyOption {
  id: FrequencyOptionId
  label: string
  sublabel: string
  days?: number
  disabled?: boolean
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: 'custom', label: 'Custom', sublabel: 'Set your own interval' },
  { id: 'daily', label: 'Daily', sublabel: 'Every 24 hours', days: 1 },
  { id: 'weekly', label: 'Weekly', sublabel: 'Every 7 Days', days: 7 },
  { id: 'monthly', label: 'Monthly', sublabel: 'Every 30 Days', days: 30 },
]

export const MAX_FREQUENCY_DAYS = 1000
export const DEFAULT_MAX_TRADES = 120
export const MAX_TRADES = 1000
export const MIN_USD_DENOMINATED_DCA_AMOUNT = 5

export const PERIOD_BUCKETS = [7, 30, 90, 180, 365, 730, 1095]
export const PERIOD_WINDOW_SIZE = 3
