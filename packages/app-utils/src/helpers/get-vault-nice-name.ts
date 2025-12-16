import { type SDKVaultishType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

export const getVaultNiceName = ({
  vault,
  overrideBase,
}: {
  vault: SDKVaultishType
  overrideBase?: string
}): string =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  vault?.customFields?.name ??
  `${overrideBase ? overrideBase : 'Summer'} ${vault.inputToken.symbol} ${capitalize(vault.protocol.network)}${vault.customFields?.risk ? ` ${capitalize(vault.customFields.risk)} risk ` : ''} Vault`
