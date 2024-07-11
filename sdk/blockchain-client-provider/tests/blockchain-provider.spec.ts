import { ChainFamilyMap } from '@summerfi/sdk-common'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { BlockchainnClientProvider } from '../src/implementation/BlockchainClientProvider'

describe('Blockchain Provider', () => {
  it('should return a provider for supported chains', async () => {
    const configProvider = new ConfigurationProvider()
    const blockchainClientProvider = new BlockchainnClientProvider({ configProvider })

    const chainInfo = ChainFamilyMap.Base.Mainnet
    const baseClient = blockchainClientProvider.getBlockchainClient({ chainInfo: chainInfo })

    expect(await baseClient.getChainId()).toEqual(chainInfo.chainId)
  })
})
