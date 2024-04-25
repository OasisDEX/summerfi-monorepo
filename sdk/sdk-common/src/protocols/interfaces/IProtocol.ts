import { ChainInfoSchema, IChainInfo, IChainInfoData } from '../../common/interfaces/IChainInfo'
import { ProtocolName } from '../enums/ProtocolName'
import { z } from 'zod'

/**
 * @interface IProtocolData
 * @description Information relative to a protocol
 */
export interface IProtocolData {
  /** The name of the protocol */
  name: ProtocolName
  /** The chain information */
  chainInfo: IChainInfoData
}

/**
 * @interface IProtocol
 * @description Interface for the implementors of the protocol
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IProtocol extends IProtocolData {
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo

  /**
   * Compare if the passed protocol is equal to the current protocol
   * @param protocol The protocol to compare
   * @returns true if the protocols are equal
   *
   * Equality is determined by the name and chain information
   */
  equals(protocol: IProtocol): boolean
}

/**
 * @description Zod schema for IProtocol
 */
export const ProtocolSchema = z.object({
  name: z.nativeEnum(ProtocolName),
  chainInfo: ChainInfoSchema,
})

/**
 * @description Type guard for IProtocol
 * @param maybeProtocol
 * @returns true if the object is an IProtocol
 */
export function isProtocol(maybeProtocol: unknown): maybeProtocol is IProtocolData {
  return ProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IProtocolData = {} as z.infer<typeof ProtocolSchema>
