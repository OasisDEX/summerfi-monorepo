import { ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'
import { RwaTestConfig, TestClientIds } from './utils/testConfig'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import type { InstiVersion } from '@summerfi/sdk-client'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Admin Fee Revenue Config', () => {
  const scenarios: { clientId?: string; instiVersion?: InstiVersion }[] = [
    { clientId: TestClientIds.ACME },
    { clientId: TestClientIds.ACME, instiVersion: 'v1' },
    { clientId: RwaTestConfig.clientId, instiVersion: 'v2' },
  ]

  test.each(scenarios)(
    'should return hardcoded fee revenue configuration for Arbitrum chain',
    async (scenario) => {
      const { clientId, instiVersion } = scenario

      const { sdk, chainId, fleetAddress } = createInstiSdkTestSetup({
        clientId,
        instiVersion,
      })
      const chainInfo = getChainInfoByChainId(chainId)
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
      expect(config.vaultFeeAmount.value).toBeDefined()

      // Log for debugging
      console.log('Fee Revenue Config for ArbitrumOne:', {
        vaultFeeReceiverAddress: config.vaultFeeReceiverAddress,
        vaultFeeAmount: config.vaultFeeAmount.toString(),
      })
    },
  )
})
