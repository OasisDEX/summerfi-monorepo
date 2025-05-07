import { ChainIds, ChainInfo } from '../src'
import { getChainFamilyInfoByChainId } from '../src/common/implementation/ChainFamilies'

describe('Chain Families', () => {
  it('should retrieve chain info by Id', () => {
    const ethereumMainnet = getChainFamilyInfoByChainId(ChainIds.Mainnet)

    expect(ethereumMainnet).toEqual({
      familyName: 'Ethereum',
      chainInfo: ChainInfo.createFrom({
        chainId: 1,
        name: 'Mainnet',
      }),
    })

    const base = getChainFamilyInfoByChainId(ChainIds.Base)

    expect(base).toEqual({
      familyName: 'Base',
      chainInfo: ChainInfo.createFrom({
        chainId: ChainIds.Base,
        name: 'Base',
      }),
    })

    const arbitrumOne = getChainFamilyInfoByChainId(42161)

    expect(arbitrumOne).toEqual({
      familyName: 'Arbitrum',
      chainInfo: ChainInfo.createFrom({
        chainId: 42161,
        name: 'ArbitrumOne',
      }),
    })

    const optimism = getChainFamilyInfoByChainId(10)

    expect(optimism).toEqual({
      familyName: 'Optimism',
      chainInfo: ChainInfo.createFrom({
        chainId: 10,
        name: 'Optimism',
      }),
    })

    const baseMainnet = getChainFamilyInfoByChainId(8453)

    expect(baseMainnet).toEqual({
      familyName: 'Base',
      chainInfo: ChainInfo.createFrom({
        chainId: 8453,
        name: 'Base',
      }),
    })
  })
})
