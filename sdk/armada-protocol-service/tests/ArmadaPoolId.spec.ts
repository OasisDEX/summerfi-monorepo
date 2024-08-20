import { Address, ChainFamilyMap } from '@summerfi/sdk-common'
import { ArmadaPoolId } from '../src'
import { ArmadaProtocol } from '../src/common/implementation/ArmadaProtocol'

describe('SDK Common | Armada | ArmadaPoolId', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const protocol = ArmadaProtocol.createFrom({ chainInfo })
  const fleetAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const poolId = ArmadaPoolId.createFrom({
        chainInfo,
        fleetAddress,
        protocol,
      })

      expect(poolId).toBeDefined()
      expect(poolId.chainInfo).toEqual(chainInfo)
      expect(poolId.fleetAddress).toEqual(fleetAddress)
      expect(poolId.protocol).toEqual(protocol)
    })
  })
})
