import { Address } from '@summerfi/sdk-common/common'
import { IExternalPosition, isExternalPosition } from '@summerfi/sdk-common/orders'

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
