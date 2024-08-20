import { Address, ChainFamilyMap, PoolType } from '@summerfi/sdk-common'
import { ArmadaPool } from '../src/common/implementation/ArmadaPool'
import { ArmadaPoolId } from '../src/common/implementation/ArmadaPoolId'
import { ArmadaProtocol } from '../src/common/implementation/ArmadaProtocol'

describe('SDK Common | Armada | ArmadaPool', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const protocol = ArmadaProtocol.createFrom({ chainInfo })
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })
  const poolId = ArmadaPoolId.createFrom({
    chainInfo,
    fleetAddress,
    protocol,
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const pool = ArmadaPool.createFrom({
        id: poolId,
      })

      expect(pool).toBeDefined()
      expect(pool.id).toEqual(poolId)
      expect(pool.type).toEqual(PoolType.Armada)
    })
  })
})
