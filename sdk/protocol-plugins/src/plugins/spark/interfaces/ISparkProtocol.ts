import { IProtocol } from '@summerfi/sdk-common'
import { ProtocolName, ProtocolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface ISparkProtocol
 * @description Identifier of the Spark protocol
 */
export interface ISparkProtocol extends IProtocol {
  /** Spark protocol name */
  name: ProtocolName.Spark
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
export function isSparkProtocol(maybeProtocol: unknown): maybeProtocol is ISparkProtocol {
  return SparkProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkProtocol = {} as z.infer<typeof SparkProtocolSchema>
