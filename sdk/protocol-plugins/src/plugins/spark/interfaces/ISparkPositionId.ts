import { IPositionId } from '@summerfi/sdk-common/common'
import { isPositionId } from '@summerfi/sdk-common'

export interface ISparkPositionId extends IPositionId {
  // Empty on purpose
}

export function isSparkPositionId(maybePositionId: unknown): maybePositionId is ISparkPositionId {
  return isPositionId(maybePositionId)
}
