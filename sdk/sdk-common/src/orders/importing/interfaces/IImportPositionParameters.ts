import { z } from 'zod'
import { IExternalLendingPosition } from './IExternalLendingPosition'

/**
 * @interface IImportPositionParameters
 * @description Parameters used to import a position from another service
 */
export interface IImportPositionParameters {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_0: 'IImportPositionParameters'
  /** External position to be imported */
  externalPosition: IExternalLendingPosition
}

/**
 * @description Zod schema for IImportPositionParameters
 */
export const ImportPositionParametersDataSchema = z.object({
  externalPosition: z.custom<IExternalLendingPosition>(),
})

/**
 * Type for the data part of the IImportPositionParameters interface
 */
export type IImportPositionParametersData = Readonly<
  z.infer<typeof ImportPositionParametersDataSchema>
>

/**
 * Type for the parameters of the IImportPositionParameters interface
 */
export type IImportPositionParametersParameters = Omit<IImportPositionParametersData, ''>

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
