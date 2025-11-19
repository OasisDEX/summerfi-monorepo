import { ArmadaVaultId, getChainInfoByChainId, ChainIds } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Admin Fee Revenue Config', () => {
  const { sdk, fleetAddress } = createAdminSdkTestSetup(TestClientIds.Targen)

  test('should return fee revenue configuration for Base chain', async () => {
    const chainInfo = getChainInfoByChainId(ChainIds.Base)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    // Call the method
    const config = await sdk.armada.admin.getFeeRevenueConfig({
      vaultId,
    })

    // Validate structure
    expect(config).toBeDefined()
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount).toBeDefined()

    // Validate hardcoded values match expected (currently placeholder values)
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount.toSolidityValue()).toBe(20000n) // 2% in basis points

    // Log for debugging
    console.log('Fee Revenue Config for Base:', config)
  })

  test('should return hardcoded fee revenue configuration for Arbitrum chain', async () => {
    const chainInfo = getChainInfoByChainId(ChainIds.ArbitrumOne)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    // Call the method
    const config = await sdk.armada.admin.getFeeRevenueConfig({
      vaultId,
    })

    // Validate structure
    expect(config).toBeDefined()
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount).toBeDefined()

    // Validate hardcoded values match expected (currently placeholder values)
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount.value).toBe(2)

    // Log for debugging
    console.log('Fee Revenue Config for ArbitrumOne:', config)
  })
})
