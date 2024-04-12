import { IExternalPosition } from './ExternalPosition'

/**
 * @interface ImportPositionParameters
 * @description Parameters used to import a position from another service
 */
export interface IImportPositionParameters {
  /** External position to be imported */
  externalPosition: IExternalPosition
}
