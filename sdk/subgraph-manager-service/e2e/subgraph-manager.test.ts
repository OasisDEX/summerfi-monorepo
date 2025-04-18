import { Address, ChainFamilyMap, User, Wallet, getChainInfoByChainId } from '@summerfi/sdk-common'
import { ConfigurationProviderMock } from '@summerfi/configuration-provider-mock'
import { SubgraphManagerFactory, type ArmadaSubgraphManager } from '../src'

describe('Subgraph Manager', () => {
  describe('Armada Subgraph Provider', () => {
    const configurationProvider = new ConfigurationProviderMock()
    let armadaSubgraph: ArmadaSubgraphManager
    beforeAll(async () => {
      armadaSubgraph = await SubgraphManagerFactory.newArmadaSubgraph({
        configProvider: configurationProvider,
      })
    })

    it('should get user positions using armada provider', async () => {
      const chainInfo = getChainInfoByChainId(ChainFamilyMap.Arbitrum.ArbitrumOne.chainId)
      if (!chainInfo) {
        throw new Error('ChainInfo not found')
      }
      const userAddress = Address.createFromEthereum({
        value: '0xe9c245293dac615c11a5bf26fcec91c3617645e4',
      })
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const userPositions = await armadaSubgraph.getUserPositions({ user })

      expect(userPositions.positions).toHaveLength(1)
      expect(userPositions.positions[0].id).toEqual(
        '0xe9c245293dac615c11a5bf26fcec91c3617645e4-0x4774d1cd62d20c288dfadefdedf79d5b4cae1856',
      )
    })
  })
})
