import {
  ChainInfoDataSchema,
  IChainInfo,
  IProtocol,
  ProtocolDataSchema,
} from '@summerfi/sdk-common'
import { IProtocolData, ProtocolName } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IAaveV3ProtocolData
 * @description Identifier of the Aave V3 protocol
 */
export interface IAaveV3ProtocolData extends IProtocolData {
  /** AaveV3 protocol name */
  readonly name: ProtocolName.AAVEv3
}

/**
 * @interface IAaveV3Protocol
 * @description Interface for the implementors of the Aave V3 protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3Protocol extends IProtocol, IAaveV3ProtocolData {
  readonly name: ProtocolName.AAVEv3

  // Re-declaring the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IAaveV3Protocol
 */
export const AaveV3ProtocolSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.AAVEv3),
  chainInfo: ChainInfoDataSchema,
})

/**
 * @description Type guard for IAaveV3Protocol
 * @param maybeProtocol
 * @returns true if the object is an IAaveV3Protocol
 */
export function isAaveV3Protocol(maybeProtocol: unknown): maybeProtocol is IAaveV3ProtocolData {
  return AaveV3ProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3ProtocolData = {} as z.infer<typeof AaveV3ProtocolSchema>
