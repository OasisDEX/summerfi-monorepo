import { SerializationService } from '../../../services/SerializationService'
import { IExternalLendingPosition } from '../interfaces'
import {
  IImportPositionParameters,
  IImportPositionParametersData,
  __signature__,
} from '../interfaces/IImportPositionParameters'
import { ExternalLendingPosition } from './ExternalLendingPosition'

/**
 * Type for the parameters of ImportPositionParameters
 */
export type ImportPositionParametersParameters = Omit<IImportPositionParametersData, ''>

/**
 * @name ImportPositionParameters
 * @see IImportPositionParameters
 */
export class ImportPositionParameters implements IImportPositionParameters {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly externalPosition: IExternalLendingPosition

  /** FACTORY */
  static createFrom(params: ImportPositionParametersParameters): ImportPositionParameters {
    return new ImportPositionParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ImportPositionParametersParameters) {
    this.externalPosition = ExternalLendingPosition.createFrom(params.externalPosition)
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Import position parameters: ${this.externalPosition}`
  }
}

SerializationService.registerClass(ImportPositionParameters, {
  identifier: 'ImportPositionParameters',
})
