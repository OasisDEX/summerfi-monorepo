import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainIds, ArmadaDcaOrderStatusEnum } from '@summerfi/sdk-common'
import { TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Strategies Resume', () => {
  const scenarios: { orderId: string }[] = [{ orderId: '<replace-with-order-id>' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { orderId } = scenario

    it('should resume a paused DCA strategy by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, userAddressValue: userAddress } = setup

      const existingOrder = await sdk.armada.dca.getBuyOrder({ orderId, userAddress })

      assert(existingOrder, `Expected order ${orderId} to exist`)

      if (existingOrder.status === ArmadaDcaOrderStatusEnum.Active) {
        console.log(`[Resume] Order ${orderId} is already active, skipping`)
        return
      }

      const account = privateKeyToAccount(TestConfigAccounts.testUserPrivateKey)

      const signedMessage = `I want to resume ${orderId}.`
      const signature = await account.signMessage({ message: signedMessage })

      const resumedOrder = await sdk.armada.dca.resumeBuyOrder({
        orderId,
        userAddress,
        signedMessage,
        signature,
      })

      assert.strictEqual(resumedOrder.status, ArmadaDcaOrderStatusEnum.Active)
      console.log(`[Resume] Resumed DCA order with ID: ${orderId}`)
    })
  })
})
