import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap } from '@summerfi/sdk-common'
import assert from 'assert'
import { TestManagerProvider, TestProviderType } from './mocks/TestManagerProvider'
import { TestManager } from './mocks/TestManagerWithProviders'

describe('SDK Server Common | Unit | ManagerProviderBase', () => {
  let testManager: TestManager

  beforeAll(async () => {
    testManager = new TestManager({
      providers: [
        new TestManagerProvider({
          type: TestProviderType.TestProvider,
          configProvider: {} as unknown as IConfigurationProvider,
          supportedChainIds: [1],
        }),
        new TestManagerProvider({
          type: TestProviderType.OtherTestProvider,
          configProvider: {} as unknown as IConfigurationProvider,
          supportedChainIds: [10],
        }),
      ],
    })
  })

  it('should return the best provider for the given chain', () => {
    const providerMainnet = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    assert(providerMainnet, 'Provider not found')

    expect(providerMainnet.type).toBe(TestProviderType.TestProvider)

    const providerOptimism = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Optimism.Optimism,
    })
    assert(providerOptimism, 'Provider not found')

    expect(providerOptimism.type).toBe(TestProviderType.OtherTestProvider)
  })

  it('should return the forced provider when requested, ignoring the chain', () => {
    const providerMainnet = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Optimism.Optimism,
      forceUseProvider: TestProviderType.TestProvider,
    })
    assert(providerMainnet, 'Provider not found')

    expect(providerMainnet.type).toBe(TestProviderType.TestProvider)

    const providerOptimism = testManager.getBestProvider({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      forceUseProvider: TestProviderType.OtherTestProvider,
    })
    assert(providerOptimism, 'Provider not found')

    expect(providerOptimism.type).toBe(TestProviderType.OtherTestProvider)
  })

  it('should throw when no provider is found for the given chain', () => {
    expect(() =>
      testManager.getBestProvider({
        chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
      }),
    ).toThrow('No provider found for chainId: 42161')
  })
})
