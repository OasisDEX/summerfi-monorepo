import { ProtocolPluginsRecord, ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'
import { IAddressBookManager } from '@summerfi/address-book-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-provider'

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
  blokchainClientProvider: IBlockchainClientProvider
  tokensManager: ITokensManager
  oracleManager: IOracleManager
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
}): IProtocolPluginsRegistry {
  const { blokchainClientProvider, addressBookManager, swapManager, tokensManager, oracleManager } =
    params

  return new ProtocolPluginsRegistry({
    plugins: ProtocolPluginsRecord,
    context: {
      provider: blokchainClientProvider,
      tokensManager,
      oracleManager,
      swapManager,
      addressBookManager,
    },
  })
}
