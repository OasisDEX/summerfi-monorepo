import { IPositionId } from '@summerfi/sdk-common/common'
import { MakerVaultId } from '../types/MakerVaultId'
import { isPositionId } from '@summerfi/sdk-common'

export interface IMakerPositionId extends IPositionId {
  vaultId: MakerVaultId
}

export function isMakerPositionId(maybePositionId: unknown): maybePositionId is IMakerPositionId {
  return isPositionId(maybePositionId) && 'vaultId' in maybePositionId
}
