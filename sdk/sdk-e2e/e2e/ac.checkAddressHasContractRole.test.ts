import { ContractSpecificRoleName } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/accessControlTestSetup'
import type { ContractRoleScenario } from './utils/types'

jest.setTimeout(300000)

const test = Object.values(ContractSpecificRoleName)
console.log(test)
process.exit()
// /**
//  * @group e2e
//  */
// describe('Armada Protocol - Access Control Contract Role Checking', () => {
//   const {
//     sdk,
//     chainId,
//     userAddress,
//     fleetAddress,
//     aqAddress,
//     governorAddress,
//     governorSendTxTool,
//   } = createAdminSdkTestSetup()
//   const contractAddress = fleetAddress

//   // Configure test scenarios here
//   const scenarios: ContractRoleScenario[] = [
//     {
//       role: ContractSpecificRoleName.WHITELISTED_ROLE,
//       targetAddress: userAddress,
//       shouldGrant: false,
//       shouldRevoke: false,
//     },
//     {
//       role: ContractSpecificRoleName.CURATOR_ROLE,
//       targetAddress: governorAddress,
//       shouldGrant: false,
//       shouldRevoke: false,
//     },
//   ]

//   test.each(scenarios)(
//     'should check contract-specific role: $role for address',
//     async ({ role, targetAddress, shouldGrant = false, shouldRevoke = false }) => {
//       if (shouldGrant) {
//         // Grant the role if not already granted
//         const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
//           chainId,
//           role,
//           contractAddress,
//           targetAddress,
//         })
//         expect(grantTxInfo).toBeDefined()
//         const grantStatus = await governorSendTxTool(grantTxInfo)
//         expect(grantStatus).toBe('success')
//       }

//       if (shouldRevoke) {
//         // Revoke the role if it was granted
//         const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
//           chainId,
//           role,
//           contractAddress,
//           targetAddress,
//         })
//         expect(revokeTxInfo).toBeDefined()
//         const revokeStatus = await governorSendTxTool(revokeTxInfo)
//         expect(revokeStatus).toBe('success')
//       }

//       const hasContractSpecificRole = await sdk.armada.accessControl.hasContractSpecificRole({
//         chainId,
//         role,
//         contractAddress,
//         targetAddress,
//       })

//       const allRoleAddresses =
//         await sdk.armada.accessControl.getAllAddressesWithContractSpecificRole({
//           chainId,
//           role,
//           contractAddress,
//         })
//       console.log(`All addresses with role ${ContractSpecificRoleName[role]}:`, allRoleAddresses)

//       console.log(
//         `Address ${targetAddress.value} ${hasContractSpecificRole ? 'has' : 'does not have'} ${ContractSpecificRoleName[role]} for contract ${contractAddress.value}`,
//       )
//     },
//   )
// })
