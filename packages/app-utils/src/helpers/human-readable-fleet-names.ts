import { type SupportedSDKNetworks } from '@summerfi/app-types'
import capitalize from 'lodash-es/capitalize'

import { sdkNetworkToHumanNetwork } from './earn-network-tools'

/**
 * Converts a fleet name from its on-chain format to a human-readable format
 * Example: "LazyVault_LowerRisk_USDT" -> "USDT Ethereum Lower Risk"
 */
export function getHumanReadableFleetName(
  network: SupportedSDKNetworks,
  fleetName: string | undefined | null,
): string {
  if (!fleetName) return ''

  // Split by underscore
  const parts = fleetName.split('_')

  // Validate we have at least 2 parts
  if (parts.length < 2) return fleetName

  // Assuming the last part is always the token symbol
  // and the middle part is the risk level
  const token = parts[parts.length - 1]
  const riskLevel = parts[parts.length - 2].replace('Risk', ' Risk') // Add space before "Risk"

  // Combine in desired order: Token Network RiskLevel
  return `${token} ${capitalize(sdkNetworkToHumanNetwork(network))} ${riskLevel}`
}
