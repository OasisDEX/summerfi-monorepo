import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainIds, ArmadaDcaOrderStatusEnum } from '@summerfi/sdk-common'
import { TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Cancel', () => {
  const scenarios: { orderId: string }[] = [{ orderId: '2ee5a4cb-31ac-4b9c-91b1-cfbcaec5e891' }]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { orderId } = scenario

    it('should cancel a DCA buy order by id', async () => {
      const setup = createSdkTestSetup({ chainId: ChainIds.Base })
      const { sdk, userAddressValue: userAddress } = setup

      const existingOrder = await sdk.armada.dca.getBuyOrder({ orderId, userAddress })

      assert(existingOrder, `Expected order ${orderId} to exist`)

      if (existingOrder.status === ArmadaDcaOrderStatusEnum.Cancelled) {
        console.log(`[Cancel] Order ${orderId} is already cancelled, skipping`)
        return
      }

      const account = privateKeyToAccount(TestConfigAccounts.testUserPrivateKey)

      const signedMessage = `I want to cancel ${orderId}.`
      const signature = await account.signMessage({ message: signedMessage })

      const cancelledOrder = await sdk.armada.dca.cancelBuyOrder({
        orderId,
        userAddress,
        signedMessage,
        signature,
      })

      assert.strictEqual(cancelledOrder.status, ArmadaDcaOrderStatusEnum.Cancelled)
      console.log(`[Cancel] Cancelled DCA order with ID: ${orderId}`)
    })
  })
})
