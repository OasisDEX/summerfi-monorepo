import { z } from 'zod'
import { ChainId, ChainIdSchema } from '../aliases/ChainId'
import { IPrintable } from './IPrintable'

/**
 * @name IChainInfo
 * @description Information used to identify a blockchain network
 */
export interface IChainInfo extends IChainInfoData, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'IChainInfo'
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
 * Type for the parameters of the IChainInfo interface
 */
export type IChainInfoParameters = Omit<IChainInfoData, ''>

/**
 * @description Type guard for IChainInfo
 * @param maybeChainInfo
 * @returns true if the object is an IChainInfo
 */
export function isChainInfo(
  maybeChainInfo: unknown,
  returnedErrors?: string[],
): maybeChainInfo is IChainInfo {
  const zodReturn = ChainInfoDataSchema.safeParse(maybeChainInfo)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
