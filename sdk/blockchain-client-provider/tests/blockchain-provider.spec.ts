import { ChainFamilyMap } from '@summerfi/sdk-common'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { BlockchainClientProvider } from '../src/implementation/BlockchainClientProvider'

describe('Blockchain Provider', () => {
  it('should return a provider for supported chains', async () => {
    const configProvider = {
      getConfigurationItem: jest.fn().mockReturnValue('https://rpc-gateway-url.com'),
    } as unknown as ConfigurationProvider

    const blockchainClientProvider = new BlockchainClientProvider({ configProvider })

    const chainInfo = ChainFamilyMap.Base.Mainnet
    const baseClient = blockchainClientProvider.getBlockchainClient({ chainInfo: chainInfo })

    expect(baseClient.chain?.id).toEqual(chainInfo.chainId)
  })
})
