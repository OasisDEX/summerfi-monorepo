import type { AddressValue } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Whitelist', () => {
  const { sdk, chainId, fleetAddress, userAddress, aqAddress, governorSendTxTool } =
    createAdminSdkTestSetup(TestClientIds.ACME)

  const whitelistModificationScenarios: {
    targetAddress: AddressValue
    shouldWhitelist?: boolean
    shouldRemoveFromWhitelist?: boolean
  }[] = [
    {
      targetAddress: aqAddress.toSolidityValue(),
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
    {
      targetAddress: userAddress.toSolidityValue(),
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
  ]

  describe('setWhitelisted - modifying whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $targetAddress',
      async ({ targetAddress, shouldWhitelist = false, shouldRemoveFromWhitelist = false }) => {
        const description =
          targetAddress === aqAddress.toSolidityValue()
            ? 'aq address'
            : targetAddress === userAddress.toSolidityValue()
              ? 'user address'
              : `address ${targetAddress}`

        // Get initial status
        const isAlreadyWhitelisted = await sdk.armada.accessControl.isWhitelisted({
          chainId,
          fleetCommanderAddress: fleetAddress.value,
          targetAddress: targetAddress,
        })
        console.log(
          `Initial whitelist status for ${description} (${targetAddress}): ${isAlreadyWhitelisted}`,
        )

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (isAlreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${description} (${targetAddress}) is already whitelisted`,
            )
          } else {
            // Add to whitelist
            console.log(`Adding ${description} (${targetAddress}) to whitelist...`)
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress,
            })
            console.log(
              `Status after whitelisting ${description} (${targetAddress}): ${afterWhitelistStatus}`,
            )
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelisted({
            chainId,
            fleetCommanderAddress: fleetAddress.value,
            targetAddress: targetAddress,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${description} (${targetAddress}) is already not whitelisted`,
            )
          } else {
            // Remove from whitelist
            console.log(`Removing ${description} (${targetAddress}) from whitelist...`)
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              targetAddress: targetAddress,
            })
            console.log(
              `Final whitelist status for ${description} (${targetAddress}): ${finalStatus}`,
            )
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
