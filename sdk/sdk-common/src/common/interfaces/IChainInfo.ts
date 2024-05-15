import { ChainId, ChainIdSchema } from '../aliases/ChainId'
import { z } from 'zod'

/**
 * @name IChainInfo
 * @description Information used to identify a blockchain network
 */
export interface IChainInfo extends IChainInfoData {
  /** The chain ID of the network */
  readonly chainId: ChainId
  /** The name of the network */
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
export const ChainInfoDataSchema = z.object({
  chainId: ChainIdSchema,
  name: z.string(),
})

/**
 * Type for the data part of the IChainInfo interface
 */
export type IChainInfoData = Readonly<z.infer<typeof ChainInfoDataSchema>>

/**
 * @description Type guard for IChainInfo
 * @param maybeChainInfo
 * @returns true if the object is an IChainInfo
 */
export function isChainInfo(maybeChainInfo: unknown): maybeChainInfo is IChainInfo {
  return ChainInfoDataSchema.safeParse(maybeChainInfo).success
}
