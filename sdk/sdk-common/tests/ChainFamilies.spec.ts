import { getChainInfoByChainId } from '../src/common/implementation/ChainFamilies'

describe('Chain Families', () => {
  it('should retrieve chain info by Id', () => {
    const ethereumMainnet = getChainInfoByChainId(1)

    expect(ethereumMainnet).toEqual({
      familyName: 'Ethereum',
      chainInfo: {
        chainId: 1,
        name: 'Mainnet',
      },
    })

    const ethereumGoerli = getChainInfoByChainId(5)

    expect(ethereumGoerli).toEqual({
      familyName: 'Ethereum',
      chainInfo: {
        chainId: 5,
        name: 'Goerli',
      },
    })

    const arbitrumOne = getChainInfoByChainId(42161)

    expect(arbitrumOne).toEqual({
      familyName: 'Arbitrum',
      chainInfo: {
        chainId: 42161,
        name: 'ArbitrumOne',
      },
    })

    const optimism = getChainInfoByChainId(10)

    expect(optimism).toEqual({
      familyName: 'Optimism',
      chainInfo: {
        chainId: 10,
        name: 'Optimism',
      },
    })

    const baseMainnet = getChainInfoByChainId(8453)

    expect(baseMainnet).toEqual({
      familyName: 'Base',
      chainInfo: {
        chainId: 8453,
        name: 'Mainnet',
      },
    })
  })
})
