import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainIds, ArmadaDcaOrderStatusEnum } from '@summerfi/sdk-common'
import { TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Pause', () => {
  const scenarios: { orderId: string }[] = [{ orderId: '<replace-with-order-id>' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { orderId } = scenario

    it('should pause an active DCA buy order by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, userAddressValue: userAddress } = setup

      const existingOrder = await sdk.armada.dca.getBuyOrder({ orderId, userAddress })

      assert(existingOrder, `Expected order ${orderId} to exist`)

      if (existingOrder.status === ArmadaDcaOrderStatusEnum.Paused) {
        console.log(`[Pause] Order ${orderId} is already paused, skipping`)
        return
      }

      const account = privateKeyToAccount(TestConfigAccounts.testUserPrivateKey)

      const signedMessage = `I want to pause ${orderId}.`
      const signature = await account.signMessage({ message: signedMessage })

      const pausedOrder = await sdk.armada.dca.pauseBuyOrder({
        orderId,
        userAddress,
        signedMessage,
        signature,
      })

      assert.strictEqual(pausedOrder.status, ArmadaDcaOrderStatusEnum.Paused)
      console.log(`[Pause] Paused DCA order with ID: ${orderId}`)
    })
  })
})
