import { IExternalPosition } from './IExternalPosition'

/**
 * @interface IImportPositionParameters
 * @description Parameters used to import a position from another service
 */
export interface IImportPositionParameters {
  /** External position to be imported */
  externalPosition: IExternalPosition
}
