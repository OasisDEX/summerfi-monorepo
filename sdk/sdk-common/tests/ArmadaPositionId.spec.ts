import { Address, ChainFamilyMap, User, Wallet } from '../src'
import { ArmadaPositionId } from '../src/common/implementation/ArmadaPositionId'

describe('SDK Common | Armada | ArmadaPositionId', () => {
  const chainInfo = ChainFamilyMap.Base.Base
  const userAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })
  const user = User.createFrom({
    chainInfo,
    wallet: Wallet.createFrom({
      address: userAddress,
    }),
  })

  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const positionId = ArmadaPositionId.createFrom({
        id: 'Test',
        user: user,
      })

      expect(positionId).toBeDefined()
      expect(positionId.id).toEqual('Test')
      expect(positionId.user).toEqual(user)
    })
  })
})
