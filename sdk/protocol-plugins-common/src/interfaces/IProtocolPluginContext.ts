import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'
import { IAddressBookManager } from '@summerfi/address-book-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-provider'

/**
 * @name IProtocolPluginContext
 * @description This is the context that will be passed to the protocol plugins to inject the different
 *              services that they might need
 */
export interface IProtocolPluginContext {
  /** The public client to interact with the blockchain */
  provider: IBlockchainClientProvider
  /** The tokens manager to retrieve token information */
  tokensManager: ITokensManager
  /** The oracle service to fetch prices */
  oracleManager: IOracleManager
  /** The swap manager to request swap quotes and calldata */
  swapManager: ISwapManager
  /** Address book to retrieve contract addresses */
  addressBookManager: IAddressBookManager
}
