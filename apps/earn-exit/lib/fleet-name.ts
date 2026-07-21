import { CHAIN_LABELS } from '@/constants/chains'

/**
 * "LazyVault_LowerRisk_USDT" on chain 1 -> "USDT Ethereum Lower Risk".
 * Mirrors getHumanReadableFleetName in @summerfi/app-utils, keyed by chainId.
 */
export const humanizeFleetName = (chainId: number, fleetName: string): string => {
  if (!fleetName) return ''

  const parts = fleetName.split('_')

  if (parts.length < 2) return fleetName

  const token = parts[parts.length - 1]
  const riskLevel = parts[parts.length - 2].replace('Risk', ' Risk')
  const network = CHAIN_LABELS[chainId] ?? ''

  return `${token} ${network} ${riskLevel}`.replace(/\s+/gu, ' ').trim()
}
