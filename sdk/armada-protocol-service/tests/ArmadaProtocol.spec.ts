import { ChainFamilyMap, ProtocolName } from '@summerfi/sdk-common'
import { ArmadaProtocol } from '../src/common/implementation/ArmadaProtocol'

describe('SDK Common | Armada | ArmadaProtocol', () => {
  const chainInfo = ChainFamilyMap.Base.Mainnet

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const protocol = ArmadaProtocol.createFrom({ chainInfo })

      expect(protocol).toBeDefined()
      expect(protocol.chainInfo).toEqual(chainInfo)
      expect(protocol.name).toEqual(ProtocolName.Armada)
    })
  })
})
