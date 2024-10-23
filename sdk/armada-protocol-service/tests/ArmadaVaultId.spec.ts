import { Address, ChainFamilyMap } from '@summerfi/sdk-common'
import { ArmadaVaultId } from '../src'
import { ArmadaProtocol } from '../src/common/implementation/ArmadaProtocol'

describe('SDK Common | Armada | ArmadaVaultId', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const protocol = ArmadaProtocol.createFrom({ chainInfo })
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const poolId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      })

      expect(poolId).toBeDefined()
      expect(poolId.chainInfo).toEqual(chainInfo)
      expect(poolId.fleetAddress).toEqual(fleetAddress)
      expect(poolId.protocol).toEqual(protocol)
    })
  })
})
