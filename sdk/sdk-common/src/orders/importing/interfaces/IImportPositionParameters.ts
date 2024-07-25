import { z } from 'zod'
import {
  ExternalLendingPositionDataSchema,
  IExternalLendingPosition,
} from './IExternalLendingPosition'

/**
 * @interface IImportPositionParameters
 * @description Parameters used to import a position from another service
 */
export interface IImportPositionParameters {
  /** External position to be imported */
  externalPosition: IExternalLendingPosition
}

/**
 * @description Zod schema for IImportPositionParameters
 */
export const ImportPositionParametersDataSchema = z.object({
  externalPosition: ExternalLendingPositionDataSchema,
})

/**
 * Type for the data part of the IImportPositionParameters interface
 */
export type IImportPositionParametersData = Readonly<
  z.infer<typeof ImportPositionParametersDataSchema>
>

/**
 * @description Type guard for IImportPositionParameters
 * @param maybeImportPositionParameters
 * @returns true if the object is an IImportPositionParameters
 */
export function isImportPositionParameters(
  maybeImportPositionParameters: unknown,
): maybeImportPositionParameters is IImportPositionParametersData {
  return ImportPositionParametersDataSchema.safeParse(maybeImportPositionParameters).success
}
