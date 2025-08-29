import { type SDKVaultishType } from '@summerfi/app-types'
import capitalize from 'lodash-es/capitalize'

export const getVaultNiceName = ({ vault }: { vault: SDKVaultishType }): string =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  vault?.customFields?.name ??
  `Summer ${vault.inputToken.symbol} ${capitalize(vault.protocol.network)}${vault.customFields?.risk ? ` ${capitalize(vault.customFields.risk)} risk ` : ''} Vault`
