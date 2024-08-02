import { z } from 'zod'
import { IChainInfo, isChainInfo } from '../../common/interfaces/IChainInfo'
import { ProtocolName } from '../enums/ProtocolName'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IProtocol
 * @description Information relative to a protocol
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IProtocol extends IProtocolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The name of the protocol */
  readonly name: ProtocolName
  /** The chain information */
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
export const ProtocolDataSchema = z.object({
  name: z.nativeEnum(ProtocolName),
  chainInfo: z.custom<IChainInfo>((val) => isChainInfo(val)),
})

/**
 * Type for the data part of the IProtocol interface
 */
export type IProtocolData = Readonly<z.infer<typeof ProtocolDataSchema>>

/**
 * @description Type guard for IProtocol
 * @param maybeProtocol
 * @returns true if the object is an IProtocol
 */
export function isProtocol(maybeProtocol: unknown): maybeProtocol is IProtocol {
  return ProtocolDataSchema.safeParse(maybeProtocol).success
}
