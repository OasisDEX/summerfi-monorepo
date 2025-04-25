import { type SDKVaultishType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

export const getVaultNiceName = ({ vault }: { vault: SDKVaultishType }): string =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  vault?.customFields?.name ??
  `Summer ${vault.inputToken.symbol} ${capitalize(vault.protocol.network)} Vault`
