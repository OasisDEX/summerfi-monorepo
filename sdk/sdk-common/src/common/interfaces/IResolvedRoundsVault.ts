import type { IAddress } from './IAddress'
import type { IChainInfo } from './IChainInfo'
import type { IToken } from './IToken'

/**
 * @interface IResolvedRoundsVault
 * @description Metadata for one side (Input or Output) of a Fleet's RoundsVault pair, resolved from
 *              the RWA subgraph. Used by the RWA manager to build deposit/withdraw transactions and
 *              round reads against the correct RoundsVault contract.
 */
export interface IResolvedRoundsVault {
  /** The chain the RoundsVault is deployed on */
  chainInfo: IChainInfo
  /** The RoundsVault contract address */
  address: IAddress
  /** Token deposited by users (Input: Fleet underlying e.g. USDC; Output: Fleet shares) */
  underlyingToken: IToken
  /** Token returned at settlement (Input: Fleet shares; Output: Fleet underlying e.g. USDC) */
  exchangeAssetToken: IToken
}
