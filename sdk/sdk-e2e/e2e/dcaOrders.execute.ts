import assert from 'assert'
import { ArmadaDcaOrderStatusEnum } from '@summerfi/sdk-common'
import { TestConfigAccounts, type TestConfigKey } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

const scenarios: { testConfigKey: TestConfigKey }[] = [{ testConfigKey: 'BaseUSDC' }]

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Read', () => {
  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey } = scenario

    it('should get a list of buy orders', async () => {
      const setup = createSdkTestSetup(testConfigKey)
      const { sdk, chainId } = setup

      const userAddress = TestConfigAccounts.testUserAddressValue

      // getBuyOrders with optional status filter
      const orders = await sdk.armada.dca.getBuyOrders({
        userAddress,
        chainId,
        status: ArmadaDcaOrderStatusEnum.Active,
      })

      //
    })
  })
})
