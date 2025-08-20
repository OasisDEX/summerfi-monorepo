import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap, ChainIds } from '@summerfi/sdk-common'
import assert from 'assert'
import { TestManagerProvider, TestProviderType } from './mocks/TestManagerProvider'
import { TestManager } from './mocks/TestManagerWithProviders'

describe('SDK Server Common | Unit | ManagerProviderBase', () => {
  let testManager: TestManager

  beforeAll(async () => {
    testManager = new TestManager({
      providers: [
        new TestManagerProvider({
          type: TestProviderType.MainnetProvider,
          configProvider: {} as unknown as IConfigurationProvider,
          supportedChainIds: [ChainIds.Mainnet],
        }),
        new TestManagerProvider({
          type: TestProviderType.ArbitrumProvider,
          configProvider: {} as unknown as IConfigurationProvider,
          supportedChainIds: [ChainIds.ArbitrumOne],
        }),
      ],
    })
  })

  it('should return the best provider for the given chain', () => {
    const providerMainnet = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    assert(providerMainnet, 'Provider not found')

    expect(providerMainnet.type).toBe(TestProviderType.MainnetProvider)

    const providerArbitrum = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
    })
    assert(providerArbitrum, 'Provider not found')

    expect(providerArbitrum.type).toBe(TestProviderType.ArbitrumProvider)
  })

  it('should return the forced provider when requested, ignoring the chain', () => {
    const providerMainnet = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
      forceUseProvider: TestProviderType.MainnetProvider,
    })
    assert(providerMainnet, 'Provider not found')

    expect(providerMainnet.type).toBe(TestProviderType.MainnetProvider)

    const providerArbitrum = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      forceUseProvider: TestProviderType.ArbitrumProvider,
    })
    assert(providerArbitrum, 'Provider not found')

    expect(providerArbitrum.type).toBe(TestProviderType.ArbitrumProvider)
  })

  it('should throw when no provider is found for the given chain', () => {
    expect(() =>
      testManager.getBestProvider({
        chainInfo: ChainFamilyMap.Optimism.Optimism, // ChainId 10 is not supported
      }),
    ).toThrow('No provider found for chainId: 10')
  })
})
