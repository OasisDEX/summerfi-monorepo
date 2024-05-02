import { ChainId, ChainIdSchema } from '../aliases/ChainId'
import { z } from 'zod'

/**
 * @name IChainInfoData
 * @description Information used to identify a blockchain network
 */
export interface IChainInfoData {
  /** The chain ID of the network */
  chainId: ChainId
  /** The name of the network */
  name: string
}

/**
 * @name IChainInfo
 * @description Interface for the implementors of the chain info
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IChainInfo extends IChainInfoData {
  readonly chainId: ChainId
  readonly name: string

  /**
   * @name equals
   * @description Checks if two chain infos are equal
   * @param chainInfo The chain info to compare
   * @returns true if the chain infos are equal
   *
   * Equality is determined by the chain ID
   */
  equals(chainInfo: IChainInfoData): boolean
}

/**
 * @description Zod schema for IChainInfo
 */
export const ChainInfoSchema = z.object({
  chainId: ChainIdSchema,
  name: z.string(),
})

/**
 * @description Type guard for IChainInfo
 * @param maybeChainInfo
 * @returns true if the object is an IChainInfo
 */
export function isChainInfo(maybeChainInfo: unknown): maybeChainInfo is IChainInfoData {
  return ChainInfoSchema.safeParse(maybeChainInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IChainInfoData = {} as z.infer<typeof ChainInfoSchema>
