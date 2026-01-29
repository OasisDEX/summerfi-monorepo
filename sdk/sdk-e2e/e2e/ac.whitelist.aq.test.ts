import { Address, type AddressValue } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { zeroAddress } from 'viem'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control AdmiralsQuarters Whitelist', () => {
  const { sdk, chainId, userAddress, governorSendTxTool } = createAdminSdkTestSetup(
    TestClientIds.ACME,
  )

  const whitelistModificationScenarios: {
    targetAddress: AddressValue
    shouldWhitelist?: boolean
    shouldRemoveFromWhitelist?: boolean
  }[] = [
    // zero address should disable whitelist in AQ
    {
      targetAddress: zeroAddress,
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
    {
      targetAddress: userAddress.toSolidityValue(),
      shouldWhitelist: false,
      shouldRemoveFromWhitelist: true,
    },
  ]

  describe('setWhitelistedAQ - modifying AdmiralsQuarters whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $targetAddress in AdmiralsQuarters',
      async ({ targetAddress, shouldWhitelist = false, shouldRemoveFromWhitelist = false }) => {
        const description =
          targetAddress === zeroAddress ? 'address(0)' : `address ${targetAddress}`

        // Get initial status
        const isAlreadyWhitelisted = await sdk.armada.accessControl.isWhitelistedAQ({
          chainId,
          targetAddress: targetAddress,
        })
        console.log(
          `Initial AdmiralsQuarters whitelist status for ${description} (${targetAddress}): ${isAlreadyWhitelisted}`,
        )

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (isAlreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${description} (${targetAddress}) is already whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Add to whitelist
            console.log(`Adding ${description} (${targetAddress}) to AdmiralsQuarters whitelist...`)
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              targetAddress: targetAddress,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              targetAddress: targetAddress,
            })
            console.log(
              `Status after whitelisting ${description} (${targetAddress}) in AdmiralsQuarters: ${afterWhitelistStatus}`,
            )
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelistedAQ({
            chainId,
            targetAddress: targetAddress,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${description} (${targetAddress}) is already not whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Remove from whitelist
            console.log(
              `Removing ${description} (${targetAddress}) from AdmiralsQuarters whitelist...`,
            )
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              targetAddress: targetAddress,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              targetAddress: targetAddress,
            })
            console.log(
              `Final AdmiralsQuarters whitelist status for ${description} (${targetAddress}): ${finalStatus}`,
            )
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
