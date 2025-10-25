import { Address } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import type { WhitelistScenario } from './utils/types'
import { zeroAddress } from 'viem'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control AdmiralsQuarters Whitelist', () => {
  const { sdk, chainId, userAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const addressZero = Address.createFromEthereum({
    value: zeroAddress,
  })

  const whitelistModificationScenarios: WhitelistScenario[] = [
    {
      targetAddress: addressZero,
      description: 'address(0)',
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
    {
      targetAddress: userAddress,
      description: 'user address',
      shouldWhitelist: false,
      shouldRemoveFromWhitelist: true,
    },
  ]

  describe('setWhitelistedAQ - modifying AdmiralsQuarters whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $description in AdmiralsQuarters',
      async ({
        description,
        targetAddress,
        shouldWhitelist = false,
        shouldRemoveFromWhitelist = false,
      }) => {
        // Get initial status
        const isAlreadyWhitelisted = await sdk.armada.accessControl.isWhitelistedAQ({
          chainId,
          targetAddress: targetAddress.value,
        })
        console.log(
          `Initial AdmiralsQuarters whitelist status for ${targetAddress.value}: ${isAlreadyWhitelisted}`,
        )

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (isAlreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${description} (${targetAddress.value}) is already whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Add to whitelist
            console.log(
              `Adding ${description} (${targetAddress.value}) to AdmiralsQuarters whitelist...`,
            )
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              targetAddress: targetAddress.value,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              targetAddress: targetAddress.value,
            })
            console.log(
              `Status after whitelisting ${description} (${targetAddress.value}) in AdmiralsQuarters: ${afterWhitelistStatus}`,
            )
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelistedAQ({
            chainId,
            targetAddress: targetAddress.value,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${description} (${targetAddress.value}) is already not whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Remove from whitelist
            console.log(
              `Removing ${description} (${targetAddress.value}) from AdmiralsQuarters whitelist...`,
            )
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              targetAddress: targetAddress.value,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              targetAddress: targetAddress.value,
            })
            console.log(
              `Final AdmiralsQuarters whitelist status for ${description} (${targetAddress.value}): ${finalStatus}`,
            )
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
