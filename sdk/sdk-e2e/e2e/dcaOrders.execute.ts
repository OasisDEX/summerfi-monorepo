import assert from 'assert'
import { ArmadaDcaOrderStatusEnum, ChainIds } from '@summerfi/sdk-common'
import { TestConfigAccounts } from './utils/testConfig'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - DCA Orders Read', () => {
  it('should get a list of buy orders', async () => {
    const setup = createSdkTestSetup({ chainId: ChainIds.Base })
    const { sdk, chainId, userAddressValue } = setup

    // getBuyOrders with optional status filter
    const orders = await sdk.armada.dca.getBuyOrders({
      userAddress: userAddressValue,
      chainId,
      status: ArmadaDcaOrderStatusEnum.Active,
    })

    // WIP: add more assertions once we have a better test setup with known orders
  })
})
