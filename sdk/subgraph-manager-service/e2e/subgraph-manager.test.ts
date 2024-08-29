import { Address, ChainFamilyMap, User, Wallet, getChainInfoByChainId } from '@summerfi/sdk-common'
import { SubgraphManagerFactory, type ArmadaSubgraphManager } from '../src'
import { ConfigurationProviderMock } from '@summerfi/testing-utils/mocks/managers/ConfigurationProviderMock'

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
      const chainInfo = getChainInfoByChainId(ChainFamilyMap.Base.Base.chainId)?.chainInfo
      if (!chainInfo) {
        throw new Error('ChainInfo not found')
      }
      const userAddress = Address.createFromEthereum({
        value: '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
      })
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const userPositions = await armadaSubgraph.getUserPositions({ chainInfo, user })

      expect(userPositions).toHaveLength(1)
      expect(userPositions[0].id.id).toEqual(
        '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da-0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
      )
    })
  })
})
