import { IAddressBookManager } from '@summerfi/address-book-common'
import type { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IOracleManager } from '@summerfi/oracle-common'
import { ISwapManager } from '@summerfi/swap-common'
import { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name IProtocolPluginContext
 * @description This is the context that will be passed to the protocol plugins to inject the different
 *              services that they might need
 */
export interface IProtocolPluginContext {
  /** The public client to interact with the blockchain */
  provider: IBlockchainClient
  /** The tokens manager to retrieve token information */
  tokensManager: ITokensManager
  /** The oracle service to fetch prices */
  oracleManager: IOracleManager
  /** The swap manager to request swap quotes and calldata */
  swapManager: ISwapManager
  /** Address book to retrieve contract addresses */
  addressBookManager: IAddressBookManager
}
