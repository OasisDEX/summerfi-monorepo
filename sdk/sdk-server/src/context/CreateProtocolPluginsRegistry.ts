import { IAddressBookManager } from '@summerfi/address-book-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { IOracleManager } from '@summerfi/oracle-common'
import { ProtocolPluginsRecord, ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap } from '@summerfi/sdk-common'
import { ISwapManager } from '@summerfi/swap-common'
import { ITokensManager } from '@summerfi/tokens-common'

/**
 * Create the protocol plugins registry
 * @param configProvider Configuration provider for environment variables
 * @param deployments Deployment index for the known deployments and dependencies
 * @param tokensManager Tokens manager for fetching known tokens
 * @param oracleManager Oracle manager for fetching prices for tokens
 * @param swapManager Swap manager for quoting swaps and getting calldata for performing swaps
 * @returns
 */
export function createProtocolsPluginsRegistry(params: {
  configProvider: ConfigurationProvider
  blockchainClientProvider: IBlockchainClientProvider
  tokensManager: ITokensManager
  oracleManager: IOracleManager
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
}): IProtocolPluginsRegistry {
  const {
    blockchainClientProvider,
    addressBookManager,
    swapManager,
    tokensManager,
    oracleManager,
  } = params

  return new ProtocolPluginsRegistry({
    plugins: ProtocolPluginsRecord,
    context: {
      provider: blockchainClientProvider.getBlockchainClient({
        chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      }),
      tokensManager,
      oracleManager,
      swapManager,
      addressBookManager,
    },
  })
}
