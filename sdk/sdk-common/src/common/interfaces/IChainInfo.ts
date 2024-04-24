import { ChainId, ChainIdSchema } from '../aliases/ChainId'
import { z } from 'zod'

/**
 * @name IChainInfo
 * @description Information used to identify a blockchain network
 */
export type IChainInfo = {
  /** The chain ID of the network */
  chainId: ChainId
  /** The name of the network */
  name: string
}

/**
 * @description Type guard for IChainInfo
 * @param maybeChainInfo
 * @returns true if the object is an IChainInfo
 */
export function isChainInfo(maybeChainInfo: unknown): maybeChainInfo is IChainInfo {
  return (
    typeof maybeChainInfo === 'object' &&
    maybeChainInfo !== null &&
    'chainId' in maybeChainInfo &&
    'name' in maybeChainInfo
  )
}

/**
 * @description Zod schema for IChainInfo
 */
export const ChainInfoSchema = z.object({
  chainId: ChainIdSchema,
  name: z.string(),
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IChainInfo = {} as z.infer<typeof ChainInfoSchema>
