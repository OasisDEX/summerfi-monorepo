import { IPositionId } from '@summerfi/sdk-common/common'
import { CompoundV3PositionParameters } from '../types/CompoundV3PositionParameters'
import { isPositionId } from '@summerfi/sdk-common'

export interface ICompoundV3PositionId extends IPositionId {
  positionParameters: CompoundV3PositionParameters
}

export function isCompoundV3PositionId(
  maybePositionId: unknown,
): maybePositionId is ICompoundV3PositionId {
  return isPositionId(maybePositionId) && 'positionParameters' in maybePositionId
}
