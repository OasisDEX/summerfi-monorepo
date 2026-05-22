import assert from 'assert'
import { privateKeyToAccount } from 'viem/accounts'
import {
  TokenAmount,
  ChainIds,
  type AddressValue,
  type ChainId,
  ArmadaDcaOrderStatusEnum,
  ArmadaVaultId,
} from '@summerfi/sdk-common'
import { FleetAddresses, TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Create', () => {
  const scenarios: {
    chainId: ChainId
    fromVaultAddressValue: AddressValue
    toVaultAddressValue: AddressValue
    amount: string
  }[] = [
    {
      chainId: ChainIds.Base,
      fromVaultAddressValue: FleetAddresses[ChainIds.Base].USDC,
      toVaultAddressValue: FleetAddresses[ChainIds.Base].ETH,
      amount: '6',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, fromVaultAddressValue, toVaultAddressValue, amount } = scenario

    it('should create, fetch, and list a DCA buy order', async () => {
      const setup = createSdkTestSetup({ chainId })
      const { sdk, userAddressValue: userAddress } = setup

      const token = await sdk.armada.users
        .getVaultInfo({
          vaultId: ArmadaVaultId.createSimple({
            chainId,
            fleetAddressValue: fromVaultAddressValue,
          }),
        })
        .then((vaultInfo) => vaultInfo.token)
      const tokenAmount = TokenAmount.createFrom({ token, amount })
      const account = privateKeyToAccount(TestConfigAccounts.testUserPrivateKey)

      const order = await sdk.armada.dca.createAndSaveBuyOrder({
        userAddress,
        chainId,
        fromVault: fromVaultAddressValue,
        toVault: toVaultAddressValue,
        signTypedData: account.signTypedData,
        amount: tokenAmount,
        slippagePercentage: '0.5',
        intervalSeconds: 3600,
        firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
        maxTrades: 10,
      })

      assert(order.id, 'Expected order id to be defined')
      console.log(`[Create] Created DCA order with ID: ${order.id}`)

      const fetchedOrder = await sdk.armada.dca.getBuyOrder({
        orderId: order.id,
        userAddress,
      })

      assert(fetchedOrder, 'Expected created order to be retrievable and active')
      assert.strictEqual(fetchedOrder.id, order.id)
      assert.strictEqual(fetchedOrder.status, ArmadaDcaOrderStatusEnum.Active)
      console.log(`[Create] Fetched DCA order with ID: ${fetchedOrder.id}`)
    })
  })
})
