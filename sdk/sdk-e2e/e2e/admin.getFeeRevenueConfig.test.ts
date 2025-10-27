import { ChainIds } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Admin Fee Revenue Config', () => {
  const { sdk } = createAdminSdkTestSetup()

  test('should return fee revenue configuration for Base chain', async () => {
    const chainId = ChainIds.Base

    // Call the method
    const config = await sdk.armada.admin.getFeeRevenueConfig({
      chainId,
    })

    // Validate structure
    expect(config).toBeDefined()
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount).toBeDefined()

    // Validate hardcoded values match expected (currently placeholder values)
    expect(config.vaultFeeReceiverAddress).toBe('0x0000000000000000000000000000000000000000')
    expect(config.vaultFeeAmount.toSolidityValue()).toBe(20000n) // 2% in basis points

    // Log for debugging
    console.log('Fee Revenue Config for Base:', config)
  })

  test('should return hardcoded fee revenue configuration for Arbitrum chain', async () => {
    const chainId = ChainIds.ArbitrumOne

    // Call the method
    const config = await sdk.armada.admin.getFeeRevenueConfig({
      chainId,
    })

    // Validate structure
    expect(config).toBeDefined()
    expect(config.vaultFeeReceiverAddress).toBeDefined()
    expect(config.vaultFeeAmount).toBeDefined()

    // Validate hardcoded values match expected (currently placeholder values)
    expect(config.vaultFeeReceiverAddress).toBe('0x0000000000000000000000000000000000000000')
    expect(config.vaultFeeAmount.toSolidityValue()).toBe(20000n)

    // Log for debugging
    console.log('Fee Revenue Config for ArbitrumOne:', config)
  })
})
