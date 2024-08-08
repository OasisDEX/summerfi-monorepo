import { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ArmadaManagerFactory } from '../src/common/implementation/ArmadaManagerFactory'

describe('SDK Common | Armada | ArmadaManagerFactory', () => {
  const configProvider: IConfigurationProvider = {} as IConfigurationProvider
  const allowanceManager: IAllowanceManager = {} as IAllowanceManager
  const contractsProvider: IContractsProvider = {} as IContractsProvider

  describe('#newArmadaManager()', () => {
    it('should instantiate with right data', () => {
      const armadaManager = ArmadaManagerFactory.newArmadaManager({
        configProvider,
        allowanceManager,
        contractsProvider,
      })

      expect(armadaManager).toBeDefined()
    })
  })
})
