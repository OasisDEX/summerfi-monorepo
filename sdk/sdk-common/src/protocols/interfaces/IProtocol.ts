import { ChainInfoSchema, IChainInfo, isChainInfo } from '../../common/interfaces/IChainInfo'
import { ProtocolName, isProtocolName } from '../enums/ProtocolName'
import { z } from 'zod'

/**
 * @interface IProtocol
 * @description Information relative to a protocol
 */
export interface IProtocol {
  name: ProtocolName
  chainInfo: IChainInfo
}

/**
 * @description Type guard for IProtocol
 * @param maybeProtocol
 * @returns true if the object is an IProtocol
 */
export function isProtocol(maybeProtocol: unknown): maybeProtocol is IProtocol {
  return (
    typeof maybeProtocol === 'object' &&
    maybeProtocol !== null &&
    'name' in maybeProtocol &&
    isProtocolName(maybeProtocol.name) &&
    'chainInfo' in maybeProtocol &&
    isChainInfo(maybeProtocol.chainInfo)
  )
}

/**
 * @description Zod schema for IProtocol
 */
export const ProtocolSchema = z.object({
  name: z.nativeEnum(ProtocolName),
  chainInfo: ChainInfoSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IProtocol = {} as z.infer<typeof ProtocolSchema>
