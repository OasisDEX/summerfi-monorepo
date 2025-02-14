import { type SDKVaultishType } from '@summerfi/app-types'

export const getUniqueVaultId = (vault: SDKVaultishType) => {
  return `${vault.id}-${vault.protocol.network}`
}
