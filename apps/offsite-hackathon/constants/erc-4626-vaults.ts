import { keyBy } from 'lodash'

export const Erc4626PseudoProtocol = 'erc-4626'

export const erc4626Vaults = [
  { id: 'steakhouse-USDC', name: 'Steakhouse USDC' },
  { id: 'steakhouse-PYUSD', name: 'Steakhouse PYUSD' },
  { id: 'steakhouse-USDT', name: 'Steakhouse USDT' },
  { id: 'steakhouse-ETH', name: 'Steakhouse ETH' },
  { id: 'flagship-ETH', name: 'Flagship ETH' },
  { id: 'flagship-USDT', name: 'Flagship USDT' },
  { id: 'flagship-USDC', name: 'Flagship USDC' },
]

export const erc4626VaultsById = keyBy(erc4626Vaults, 'id')
export const erc4626VaultsByName = keyBy(erc4626Vaults, 'name')
