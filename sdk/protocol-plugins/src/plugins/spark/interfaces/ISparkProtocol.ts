import { IProtocolData, ProtocolName, ProtocolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface ISparkProtocolData
 * @description Identifier of the Spark protocol
 */
export interface ISparkProtocolData extends IProtocolData {
  /** Spark protocol name */
  readonly name: ProtocolName.Spark
}

/**
 * @interface ISparkProtocol
 * @description Interface for the implementors of the Spark protocol
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ISparkProtocol extends ISparkProtocolData {
  readonly name: ProtocolName.Spark
}

/**
 * @description Zod schema for ISparkProtocol
 */
export const SparkProtocolSchema = z.object({
  ...ProtocolSchema.shape,
  name: z.literal(ProtocolName.Spark),
})

/**
 * @description Type guard for ISparkProtocol
 * @param maybeProtocol
 * @returns true if the object is an ISparkProtocol
 */
export function isSparkProtocol(maybeProtocol: unknown): maybeProtocol is ISparkProtocolData {
  return SparkProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkProtocolData = {} as z.infer<typeof SparkProtocolSchema>
