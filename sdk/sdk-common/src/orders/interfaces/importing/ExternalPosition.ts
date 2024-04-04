import { Address, Position } from "src/common";

export enum ExternalPositionType {
    WALLET = 'WALLET',
    DS_PROXY = 'DS_PROXY',
  }
  
export interface ExternalPositionId {
    type: ExternalPositionType
    address: Address
}

/**
 * @interface ExternalPosition
 * @description Position existing in another service. This will be specialized into the IDs for the
 *              different services.
 */
export interface ExternalPosition  {
  position: Position
  externalId: ExternalPositionId
}
