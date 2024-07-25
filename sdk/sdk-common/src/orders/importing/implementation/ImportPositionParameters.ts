import { SerializationService } from '../../../services/SerializationService'
import { IExternalLendingPosition } from '../interfaces'
import { IImportPositionParameters } from '../interfaces/IImportPositionParameters'
import { ExternalLendingPosition } from './ExternalLendingPosition'

/**
 * @name ImportPositionParameters
 * @see IImportPositionParameters
 */
export class ImportPositionParameters implements IImportPositionParameters {
  readonly externalPosition: IExternalLendingPosition

  /** Factory method */
  static createFrom(params: IImportPositionParameters): ImportPositionParameters {
    return new ImportPositionParameters(params)
  }

  /** Sealed constructor */
  private constructor(params: IImportPositionParameters) {
    this.externalPosition = ExternalLendingPosition.createFrom(params.externalPosition)
  }

  toString(): string {
    return `Import position parameters: ${this.externalPosition}`
  }
}

SerializationService.registerClass(ImportPositionParameters)
