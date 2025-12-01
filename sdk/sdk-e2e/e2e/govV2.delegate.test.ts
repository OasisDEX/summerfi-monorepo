import assert from 'assert'
import { zeroAddress } from 'viem'

import { createSdkTestSetup } from './utils/createSdkTestSetup'
import { type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Gov V2 Delegate', () => {
  const scenarios: {
    testConfigKey?: TestConfigKey
  }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario

    // Setup SDK and tools
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, userAddress: _ua, userSendTxTool } = setup
    const userAddress = _ua.toSolidityValue()

    it('should get user delegatee V2', async () => {
      const delegatee = await sdk.armada.users.getUserDelegateeV2({ userAddress })

      expect(delegatee).toBeDefined()
      console.log('User delegatee V2:', delegatee.value)
    })

    it('should delegate to self using V2', async () => {
      // Get delegatee before delegation
      const delegateeBefore = await sdk.armada.users.getUserDelegateeV2({ userAddress })
      console.log('Delegatee before:', delegateeBefore.value)

      // Get delegate transaction
      const delegateTx = await sdk.armada.users.getDelegateTxV2({
        delegateeAddress: userAddress,
      })

      // Execute transaction
      const delegateStatus = await userSendTxTool(delegateTx)
      delegateStatus.forEach((s) => expect(s).toBe('success'))

      // Get delegatee after delegation
      const delegateeAfter = await sdk.armada.users.getUserDelegateeV2({ userAddress })
      console.log('Delegatee after:', delegateeAfter.value)

      // Verify user is now delegating to themselves
      expect(delegateeAfter.value.toLowerCase()).toEqual(userAddress)
    })

    it('should undelegate using V2', async () => {
      // Ensure user has a delegatee
      const delegateeBefore = await sdk.armada.users.getUserDelegateeV2({ userAddress })
      console.log('Delegatee before undelegate:', delegateeBefore.value)
      assert(
        delegateeBefore.value.toLowerCase() !== zeroAddress,
        'User should have a delegatee before undelegating',
      )

      // Get undelegate transaction (delegate to zero address)
      const undelegateTx = await sdk.armada.users.getDelegateTxV2({
        delegateeAddress: zeroAddress,
      })

      // Execute transaction
      const undelegateStatus = await userSendTxTool(undelegateTx)
      undelegateStatus.forEach((s) => expect(s).toBe('success'))

      // Get delegatee after undelegation
      const delegateeAfter = await sdk.armada.users.getUserDelegateeV2({ userAddress })
      console.log('Delegatee after undelegate:', delegateeAfter.value)

      // Verify user is no longer delegating
      expect(delegateeAfter.value.toLowerCase()).toEqual(zeroAddress)
    })
  })
})
