import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

export const getInstiVaultNiceName = ({
  symbol,
  network,
  institutionName,
  customName,
}: {
  symbol: string
  network: string
  institutionName?: string
  // Vault's configured display name (fleetMap `name`, e.g. "Avantgarde Orthodox USDC"). When present
  // it takes precedence over the derived "{institution} {symbol} {network}" label.
  customName?: string | null
}) => {
  if (customName) {
    return customName
  }

  return `${institutionName ? `${institutionName} ` : ''}${symbol} ${sdkNetworkToHumanNetwork(supportedSDKNetwork(network))}`
}
