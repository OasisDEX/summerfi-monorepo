import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { ProtocolDataSchema, ProtocolName } from '@summerfi/sdk-common/common'
import { z } from 'zod'

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
  /** Spark protocol name */
  readonly name: ProtocolName.Spark

  // Re-declaring the properties with the right types
  readonly chainInfo: IChainInfo
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
