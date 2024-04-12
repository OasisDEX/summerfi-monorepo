import { isPosition } from '../../../common'
import { Address } from '../../../common/implementation/Address'
import { Position } from '../../../common/implementation/Position'

export enum ExternalPositionType {
  WALLET = 'WALLET',
  DS_PROXY = 'DS_PROXY',
}

export interface IExternalPositionId {
  type: ExternalPositionType
  address: Address
}

export function isExternalPositionId(maybeId: unknown): maybeId is IExternalPositionId {
  return (
    typeof maybeId === 'object' && maybeId !== null && 'type' in maybeId && 'address' in maybeId
  )
}

/**
 * @interface IExternalPosition
 * @description Position existing in another service. This will be specialized into the IDs for the
 *              different services.
 */
export interface IExternalPosition {
  position: Position
  externalId: IExternalPositionId
}

export function isExternalPosition(maybePosition: unknown): maybePosition is IExternalPosition {
  return (
    typeof maybePosition === 'object' &&
    maybePosition !== null &&
    'position' in maybePosition &&
    isPosition(maybePosition.position) &&
    'externalId' in maybePosition &&
    isExternalPositionId(maybePosition.externalId)
  )
}
