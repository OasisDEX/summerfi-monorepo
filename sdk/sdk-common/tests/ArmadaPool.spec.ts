import { ChainFamilyMap, Address, PoolType } from '../src'
import { ArmadaVault } from '../src/common/implementation/ArmadaVault'
import { ArmadaVaultId } from '../src/common/implementation/ArmadaVaultId'

describe('SDK Common | Armada | ArmadaPool', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })
  const poolId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const pool = ArmadaVault.createFrom({
        id: poolId,
      })

      expect(pool).toBeDefined()
      expect(pool.id).toEqual(poolId)
      expect(pool.type).toEqual(PoolType.Armada)
    })
  })
})
