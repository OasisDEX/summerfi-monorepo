import { Address, IPosition } from '../../../common'

export enum ExternalPositionType {
  WALLET = 'WALLET',
  DS_PROXY = 'DS_PROXY',
}

export interface ExternalPositionId {
  type: ExternalPositionType
  address: Address
}

/**
 * @interface IExternalPosition
 * @description Position existing in another service. This will be specialized into the IDs for the
 *              different services.
 */
export interface IExternalPosition {
  position: IPosition
  externalId: ExternalPositionId
}
