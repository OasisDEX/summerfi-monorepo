import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import type { WhitelistScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Whitelist', () => {
  const { sdk, chainId, fleetAddress, userAddress, aqAddress, governorSendTxTool } =
    createAdminSdkTestSetup()

  const whitelistModificationScenarios: WhitelistScenario[] = [
    {
      targetAddress: aqAddress,
      description: 'aq address',
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
    {
      targetAddress: userAddress,
      description: 'user address',
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
  ]

  describe('setWhitelisted - modifying whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $description',
      async ({
        description,
        targetAddress,
        shouldWhitelist = false,
        shouldRemoveFromWhitelist = false,
      }) => {
        // Get initial status
        const isAlreadyWhitelisted = await sdk.armada.accessControl.isWhitelisted({
          chainId,
          fleetCommanderAddress: fleetAddress.value,
          targetAddress: targetAddress.value,
        })
        console.log(
          `Initial whitelist status for ${description} (${targetAddress.value}): ${isAlreadyWhitelisted}`,
        )

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (isAlreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${description} (${targetAddress.value}) is already whitelisted`,
            )
          } else {
            // Add to whitelist
            console.log(`Adding ${description} (${targetAddress.value}) to whitelist...`)
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress.value,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress.value,
            })
            console.log(
              `Status after whitelisting ${description} (${targetAddress.value}): ${afterWhitelistStatus}`,
            )
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelisted({
            chainId,
            fleetCommanderAddress: fleetAddress.value,
            targetAddress: targetAddress.value,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${description} (${targetAddress.value}) is already not whitelisted`,
            )
          } else {
            // Remove from whitelist
            console.log(`Removing ${description} (${targetAddress.value}) from whitelist...`)
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress.value,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress.value,
            })
            console.log(
              `Final whitelist status for ${description} (${targetAddress.value}): ${finalStatus}`,
            )
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
