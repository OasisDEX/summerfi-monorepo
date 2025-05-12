import { ChainFamilyMap, Address, PoolType } from '../src'
import { ArmadaVault } from '../src/common/implementation/ArmadaVault'
import { ArmadaVaultId } from '../src/common/implementation/ArmadaVaultId'

describe('SDK Common | Armada | ArmadaVault', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const vault = ArmadaVault.createFrom({
        id: vaultId,
      })

      expect(vault).toBeDefined()
      expect(vault.id).toEqual(vaultId)
      expect(vault.type).toEqual(PoolType.Armada)
    })
  })
})
