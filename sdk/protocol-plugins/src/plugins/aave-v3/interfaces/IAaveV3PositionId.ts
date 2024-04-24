import { IPositionId } from '@summerfi/sdk-common/common'
import { isPositionId } from '@summerfi/sdk-common'

export interface IAaveV3PositionId extends IPositionId {
  // Empty on purpose
}

export function isAavev3PositionId(maybePositionId: unknown): maybePositionId is IAaveV3PositionId {
  return isPositionId(maybePositionId)
}
