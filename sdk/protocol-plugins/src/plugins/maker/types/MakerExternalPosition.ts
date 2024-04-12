import { Address } from '@summerfi/sdk-common/common'
import { IExternalPosition } from '@summerfi/sdk-common/orders'
import { isExternalPosition } from 'node_modules/@summerfi/sdk-common/src/orders/interfaces/importing/IExternalPosition'

export interface MakerExternalPosition extends IExternalPosition {
  dsProxyAddress: Address
  vaultId: string
}

export function isMakerExternalPosition(
  maybePosition: unknown,
): maybePosition is MakerExternalPosition {
  return (
    isExternalPosition(maybePosition) &&
    'vaultId' in maybePosition &&
    'dsProxyAddress' in maybePosition
  )
}
