import { IProtocol, ProtocolDataSchema, ProtocolName } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ISparkProtocol
 * @description Identifier of the Spark protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkProtocol extends ISparkProtocolData, IProtocol {
  /** Interface signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol

  // Re-declaring the properties with the right types
  readonly name: ProtocolName.Spark
}

/**
 * @description Zod schema for ISparkProtocol
 */
export const SparkProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.Spark),
})

/**
 * Type for the data part of ISparkProtocol
 */
export type ISparkProtocolData = Readonly<z.infer<typeof SparkProtocolDataSchema>>

/**
 * @description Type guard for ISparkProtocol
 * @param maybeProtocol
 * @returns true if the object is an ISparkProtocol
 */
export function isSparkProtocol(maybeProtocol: unknown): maybeProtocol is ISparkProtocol {
  return SparkProtocolDataSchema.safeParse(maybeProtocol).success
}
