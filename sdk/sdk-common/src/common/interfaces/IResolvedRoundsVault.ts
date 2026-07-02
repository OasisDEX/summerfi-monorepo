import type { AddressValue } from '../types/AddressValue'
import type { ChainId } from '../types/ChainId'
import type { IToken } from './IToken'
import type { ITokenAmount } from './ITokenAmount'

/**
 * Metadata for one side (Input or Output) of a Fleet's RoundsVault pair, resolved from
 * the RWA subgraph. Used by the RWA manager to build deposit/withdraw transactions and
 * round reads against the correct RoundsVault contract.
 */
export interface IResolvedRoundsVault {
  /** The chain the RoundsVault is deployed on */
  chainId: ChainId
  /** The RoundsVault contract address */
  address: AddressValue
  /** Token deposited by users (Input: Fleet underlying e.g. USDC; Output: Fleet shares) */
  underlyingToken: IToken
  /** Token returned at settlement (Input: Fleet shares; Output: Fleet underlying e.g. USDC) */
  exchangeAssetToken: IToken
  /** Minimum position size in underlying token for the RoundsVault */
  minPositionSize: ITokenAmount
}
