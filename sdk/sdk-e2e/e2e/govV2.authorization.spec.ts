import { Address, User, type AddressValue } from '@summerfi/sdk-common'
import { createSdkTestSetup } from './utils/createSdkTestSetup'
import type { TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Gov V2 Authorization', () => {
  const scenarios: {
    testConfigKey: TestConfigKey
    shouldAuthorize: boolean
    target?: AddressValue
  }[] = [
    // {
    //   testConfigKey: 'BaseUSDC',
    //   shouldAuthorize: true,
    // },
    // {
    //   testConfigKey: 'BaseUSDC',
    //   shouldAuthorize: false,
    // },
    {
      testConfigKey: 'BaseUSDC',
      shouldAuthorize: false,
      target: '0x4e92071F9BC94011419Dc03fEaCA32D11241313a', // aq
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey, shouldAuthorize, target } = scenario
    const setup = createSdkTestSetup(chainConfigKey)
    const { sdk, chainId, userAddress, userSendTxTool } = setup

    const user = User.createFromEthereum(chainId, userAddress.value)

    // Use a deterministic test address as the authorized caller
    const testAuthorizedCaller = Address.createFromEthereum({
      value: target ?? '0x0000000000000000000000000000000000000001',
    })

    it(`should ${shouldAuthorize ? 'authorize' : 'revoke authorization for'} a caller for staking rewards`, async () => {
      // Check initial authorization status
      const initialAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: userAddress,
        authorizedCaller: testAuthorizedCaller,
      })
      console.log(
        `Initial authorization status for ${testAuthorizedCaller.value}: ${initialAuthStatus}`,
      )

      // If we're trying to authorize and already authorized, or revoke and not authorized, skip
      if (shouldAuthorize === initialAuthStatus) {
        console.log(
          `Skipping - caller is already ${shouldAuthorize ? 'authorized' : 'not authorized'}`,
        )
        return
      }

      // Set authorization
      const authorizeTx = await sdk.armada.users.authorizeStakingRewardsCallerV2({
        user,
        authorizedCaller: testAuthorizedCaller,
        isAuthorized: shouldAuthorize,
      })

      expect(authorizeTx).toBeDefined()
      expect(authorizeTx).toHaveLength(1)

      // Send the transaction
      const txStatus = await userSendTxTool(authorizeTx, { confirmations: 5 })
      expect(txStatus).toStrictEqual(['success'])

      // Verify the authorization status changed
      const afterAuthStatus = await sdk.armada.users.isAuthorizedStakingRewardsCallerV2({
        owner: userAddress,
        authorizedCaller: testAuthorizedCaller,
      })
      console.log(
        `Authorization status after ${shouldAuthorize ? 'authorization' : 'revocation'}: ${afterAuthStatus}`,
      )
      expect(afterAuthStatus).toBe(shouldAuthorize)
    })
  })
})
