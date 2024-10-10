import { Address, ChainFamilyMap, User, Wallet } from '@summerfi/sdk-common'
import { ArmadaUsersSimulation } from '../src/simulator/implementation/users/ArmadaUsersSimulation'
import { ArmadaPositionMock } from './mocks/ArmadaPositionMock'

describe('SDK Common | Armada | ArmadaSimulation', () => {
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
      const simulation = ArmadaUsersSimulation.createFrom({
        user,
        previousPosition: ArmadaPositionMock,
        newPosition: ArmadaPositionMock,
      })

      expect(simulation).toBeDefined()
      expect(simulation.user).toEqual(user)
      expect(simulation.previousPosition).toEqual(ArmadaPositionMock)
      expect(simulation.newPosition).toEqual(ArmadaPositionMock)
    })
  })
})
