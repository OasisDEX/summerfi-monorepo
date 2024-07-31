import { SerializationService } from '../../../services/SerializationService'
import { IExternalLendingPosition } from '../interfaces'
import {
  IImportPositionParameters,
  IImportPositionParametersParameters,
  __iimportpositionparameters__,
} from '../interfaces/IImportPositionParameters'
import { ExternalLendingPosition } from './ExternalLendingPosition'

/**
 * @name ImportPositionParameters
 * @see IImportPositionParameters
 */
export class ImportPositionParameters implements IImportPositionParameters {
  /** SIGNATURE */
  readonly [__iimportpositionparameters__] = 'IImportPositionParameters'

  /** ATTRIBUTES */
  readonly externalPosition: IExternalLendingPosition

  /** FACTORY */
  static createFrom(params: IImportPositionParametersParameters): ImportPositionParameters {
    return new ImportPositionParameters(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IImportPositionParametersParameters) {
    this.externalPosition = ExternalLendingPosition.createFrom(params.externalPosition)
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Import position parameters: ${this.externalPosition}`
  }
}

SerializationService.registerClass(ImportPositionParameters)
