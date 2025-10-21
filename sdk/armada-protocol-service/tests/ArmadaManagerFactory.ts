import { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ArmadaManagerFactory } from '../src/common/implementation/ArmadaManagerFactory'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'

describe('SDK Common | Armada | ArmadaManagerFactory', () => {
  const configProvider: IConfigurationProvider = {} as IConfigurationProvider
  const allowanceManager: IAllowanceManager = {} as IAllowanceManager
  const contractsProvider: IContractsProvider = {} as IContractsProvider
  const subgraphManager = {} as IArmadaSubgraphManager

  describe('#newArmadaManager()', () => {
    it('should instantiate with right data', () => {
      const armadaManager = ArmadaManagerFactory.newArmadaManager({
        configProvider,
        allowanceManager,
        contractsProvider,
        subgraphManager,
        blockchainClientProvider: {} as any,
        deploymentProvider: {} as any,
        swapManager: {} as any,
        oracleManager: {} as any,
        tokensManager: {} as any,
      })

      expect(armadaManager).toBeDefined()
    })
  })
})
