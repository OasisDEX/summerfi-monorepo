import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap } from '@summerfi/sdk-common'
import { BlockchainClientProvider } from '../src/implementation/BlockchainClientProvider'

describe('Blockchain Provider', () => {
  let blockchainClientProvider: IBlockchainClientProvider

  beforeEach(() => {
    const configProvider = {
      getConfigurationItem: jest.fn().mockReturnValue('https://rpc-gateway-url.com'),
    } as unknown as IConfigurationProvider

    blockchainClientProvider = new BlockchainClientProvider({ configProvider })
  })

  it('should return a provider for supported chains', async () => {
    const chainInfo = ChainFamilyMap.Base.Mainnet
    const baseClient = blockchainClientProvider.getBlockchainClient({ chainInfo: chainInfo })

    expect(baseClient.chain?.id).toEqual(chainInfo.chainId)
  })

  it('should return a provider for custom chains', async () => {
    const chainInfo = ChainFamilyMap.Base.Mainnet
    const baseClient = blockchainClientProvider.getBlockchainClient({
      rpcUrl: 'https://custom-rpc.com',
      chainInfo: chainInfo,
    })

    expect(baseClient.chain?.id).toEqual(chainInfo.chainId)
  })
})
