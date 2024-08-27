import { SubgraphProviderType } from '@summerfi/sdk-common'
import { SubgraphManagerFactory } from '../src'
import { ConfigurationProviderMock } from '@summerfi/testing-utils/mocks/managers/ConfigurationProviderMock'

describe('Subgraph Manager', () => {
  describe('Armada Subgraph Provider', () => {
    const configurationProvider = new ConfigurationProviderMock()
    beforeAll(async () => {
      const armadaSubgraph = await SubgraphManagerFactory.newArmadaSubgraph({
        configProvider: configurationProvider,
      })

      it('should get user positions using armada provider', async () => {
        const chainInfo = { chainId: 1 }
        const userAddress = { value: '0x123' }

        const userPositions = armadaSubgraph.getUserPositions({ chainInfo, userAddress })

        expect(userPositions).toEqual([])
      })
    })
  })
})
