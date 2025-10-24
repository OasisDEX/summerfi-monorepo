import { Address } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'
import type { WhitelistScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control AdmiralsQuarters Whitelist', () => {
  const { sdk, chainId, userAddress, governorSendTxTool } = createAdminSdkTestSetup()

  const randomAddress = Address.createFromEthereum({
    value: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  })

  const addressZero = Address.createFromEthereum({
    value: '0x0000000000000000000000000000000000000000',
  })

  // Configure test scenarios here
  const whitelistCheckScenarios: WhitelistScenario[] = [
    {
      targetAddress: randomAddress,
      description: 'random address - not whitelisted',
      shouldWhitelist: false,
      shouldRemoveFromWhitelist: false,
    },
  ]

  const whitelistModificationScenarios: WhitelistScenario[] = [
    {
      targetAddress: addressZero,
      description: 'address(0) - whitelist',
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: false,
    },
  ]

  describe('isWhitelistedAQ - checking AdmiralsQuarters whitelist status', () => {
    test.each(whitelistCheckScenarios)(
      'should check if $description is whitelisted in AdmiralsQuarters',
      async ({ targetAddress }) => {
        const isWhitelisted = await sdk.armada.accessControl.isWhitelistedAQ({
          chainId,
          account: targetAddress.value,
        })

        console.log(
          `Address ${targetAddress.value} ${isWhitelisted ? 'is' : 'is not'} whitelisted in AdmiralsQuarters`,
        )
        expect(typeof isWhitelisted).toBe('boolean')
      },
    )
  })

  describe('setWhitelistedAQ - modifying AdmiralsQuarters whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $description in AdmiralsQuarters',
      async ({ targetAddress, shouldWhitelist = false, shouldRemoveFromWhitelist = false }) => {
        // Get initial status
        const alreadyWhitelisted = await sdk.armada.accessControl.isWhitelistedAQ({
          chainId,
          account: targetAddress.value,
        })
        console.log(
          `Initial AdmiralsQuarters whitelist status for ${targetAddress.value}: ${alreadyWhitelisted}`,
        )

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (alreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${targetAddress.value} is already whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Add to whitelist
            console.log(`Adding ${targetAddress.value} to AdmiralsQuarters whitelist...`)
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              account: targetAddress.value,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              account: targetAddress.value,
            })
            console.log(
              `After whitelisting ${targetAddress.value} in AdmiralsQuarters: ${afterWhitelistStatus}`,
            )
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelistedAQ({
            chainId,
            account: targetAddress.value,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${targetAddress.value} is already not whitelisted in AdmiralsQuarters`,
            )
          } else {
            // Remove from whitelist
            console.log(`Removing ${targetAddress.value} from AdmiralsQuarters whitelist...`)
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
              chainId,
              account: targetAddress.value,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelistedAQ({
              chainId,
              account: targetAddress.value,
            })
            console.log(
              `Final AdmiralsQuarters whitelist status for ${targetAddress.value}: ${finalStatus}`,
            )
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
