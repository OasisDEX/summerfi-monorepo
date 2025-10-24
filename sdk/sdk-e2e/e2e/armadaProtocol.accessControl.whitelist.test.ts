import { Address } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'
import type { WhitelistScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Whitelist', () => {
  const { sdk, chainId, fleetAddress, userAddress, governorSendTxTool } =
    createAdminSdkTestSetup()

  const testAddress = Address.createFromEthereum({
    value: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  })

  // Configure test scenarios here
  const whitelistCheckScenarios: WhitelistScenario[] = [
    {
      targetAddress: testAddress,
      description: 'test address - not whitelisted',
      shouldWhitelist: false,
      shouldRemoveFromWhitelist: false,
    },
  ]

  const whitelistModificationScenarios: WhitelistScenario[] = [
    {
      targetAddress: userAddress,
      description: 'test address 1 - whitelist then remove',
      shouldWhitelist: true,
      shouldRemoveFromWhitelist: true,
    },
  ]

  describe('isWhitelisted - checking whitelist status', () => {
    test.each(whitelistCheckScenarios)(
      'should check if $description is whitelisted',
      async ({ targetAddress }) => {
        const isWhitelisted = await sdk.armada.accessControl.isWhitelisted({
          chainId,
          fleetCommanderAddress: fleetAddress.value,
          account: targetAddress.value,
        })

        console.log(`Address ${targetAddress.value} ${isWhitelisted ? 'is' : 'is not'} whitelisted`)
        expect(typeof isWhitelisted).toBe('boolean')
      },
    )
  })

  describe('setWhitelisted - modifying whitelist status', () => {
    test.each(whitelistModificationScenarios)(
      'should handle whitelist operations for $description',
      async ({ targetAddress, shouldWhitelist = false, shouldRemoveFromWhitelist = false }) => {
        // Get initial status
        const alreadyWhitelisted = await sdk.armada.accessControl.isWhitelisted({
          chainId,
          fleetCommanderAddress: fleetAddress.value,
          account: targetAddress.value,
        })
        console.log(`Initial whitelist status for ${targetAddress.value}: ${alreadyWhitelisted}`)

        if (shouldWhitelist) {
          // Skip if already whitelisted
          if (alreadyWhitelisted) {
            console.log(
              `Skipping whitelist operation - ${targetAddress.value} is already whitelisted`,
            )
          } else {
            // Add to whitelist
            console.log(`Adding ${targetAddress.value} to whitelist...`)
            const whitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              account: targetAddress.value,
              allowed: true,
            })

            expect(whitelistTxInfo).toBeDefined()
            const whitelistStatus = await governorSendTxTool(whitelistTxInfo)
            expect(whitelistStatus).toBe('success')

            // Verify the address is now whitelisted
            const afterWhitelistStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              account: targetAddress.value,
            })
            console.log(`After whitelisting ${targetAddress.value}: ${afterWhitelistStatus}`)
            expect(afterWhitelistStatus).toBe(true)
          }
        }

        if (shouldRemoveFromWhitelist) {
          // Get current status to check if we need to remove
          const currentStatus = await sdk.armada.accessControl.isWhitelisted({
            chainId,
            fleetCommanderAddress: fleetAddress.value,
            account: targetAddress.value,
          })

          // Skip if already not whitelisted
          if (!currentStatus) {
            console.log(
              `Skipping remove operation - ${targetAddress.value} is already not whitelisted`,
            )
          } else {
            // Remove from whitelist
            console.log(`Removing ${targetAddress.value} from whitelist...`)
            const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              account: targetAddress.value,
              allowed: false,
            })

            expect(removeWhitelistTxInfo).toBeDefined()
            const removeStatus = await governorSendTxTool(removeWhitelistTxInfo)
            expect(removeStatus).toBe('success')

            // Verify the address is no longer whitelisted
            const finalStatus = await sdk.armada.accessControl.isWhitelisted({
              chainId,
              fleetCommanderAddress: fleetAddress.value,
              account: targetAddress.value,
            })
            console.log(`Final whitelist status for ${targetAddress.value}: ${finalStatus}`)
            expect(finalStatus).toBe(false)
          }
        }
      },
    )
  })
})
