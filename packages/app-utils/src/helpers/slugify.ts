import { type SDKVaultishType } from '@summerfi/app-types'

import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@/helpers/earn-network-tools'

export const slugify: (value: string) => string = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 50) || 'user'

export const slugifyVault: (vault: SDKVaultishType) => string = (vault) => {
  return `${vault.inputToken.symbol.toLowerCase()}-${sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network))}-${vault.isDaoManaged ? 'higher' : vault.customFields?.risk ?? 'lower'}`
}
