import { GraphRoleName, AddressValue } from '@summerfi/sdk-common'
import { createAdminSdkTestSetup } from './utils/createAdminSdkTestSetup'
import { TestClientIds } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Access Control Get All Roles', () => {
  const scenarios: {
    roleName?: GraphRoleName
    targetContract?: 'fleetAddress' | 'aqAddress'
    owner?: AddressValue
    first?: number
    skip?: number
  }[] = [
    {},
    {
      roleName: GraphRoleName.WHITELIST_ROLE,
    },
    {
      targetContract: 'fleetAddress',
    },
    {
      targetContract: 'aqAddress',
    },
    {
      roleName: GraphRoleName.WHITELIST_ROLE,
      targetContract: 'fleetAddress',
    },
    {
      first: 5,
    },
    {
      skip: 2,
      first: 3,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { roleName, targetContract: targetContractKey, owner, first, skip } = scenario

    it('should fetch roles', async () => {
      const { sdk, chainId, fleetAddress, aqAddress } = createAdminSdkTestSetup(TestClientIds.ACME)

      // Resolve targetContract from key
      const targetContract =
        targetContractKey === 'fleetAddress'
          ? fleetAddress.value
          : targetContractKey === 'aqAddress'
            ? aqAddress.value
            : undefined

      console.log(
        '=== Getting all roles' +
          (targetContractKey ? `, targetContract: ${targetContract}` : '') +
          (roleName ? `, roleName: ${roleName}` : '') +
          (owner ? `, owner: ${owner}` : '') +
          (first ? `, first: ${first}` : '') +
          (skip ? `, skip: ${skip}` : '') +
          ' ===',
      )

      const result = await sdk.armada.accessControl.getAllRoles({
        chainId,
        name: roleName,
        targetContract,
        owner,
        first,
        skip,
      })

      expect(result).toBeDefined()
      expect(result.roles).toBeDefined()
      expect(Array.isArray(result.roles)).toBe(true)

      // Log details about the roles found
      if (result.roles.length > 0) {
        const roleDetails = result.roles.map((role, index) => {
          // Verify role structure
          expect(role.id).toBeDefined()
          expect(typeof role.id).toBe('string')
          expect(role.name).toBeDefined()
          expect(typeof role.name).toBe('string')
          expect(role.owner).toBeDefined()
          expect(typeof role.owner).toBe('string')
          expect(role.targetContract).toBeDefined()
          expect(typeof role.targetContract).toBe('string')
          expect(role.institution).toBeDefined()
          expect(role.institution.id).toBeDefined()
          expect(typeof role.institution.id).toBe('string')

          return (
            `[${index + 1}] Role:\n` +
            `  ID: ${role.id}\n` +
            `  Name: ${role.name}\n` +
            `  Owner: ${role.owner}\n` +
            `  Target Contract: ${role.targetContract}\n` +
            `  Institution ID: ${role.institution.id}`
          )
        })

        console.log('\nRole details:\n\n' + roleDetails.join('\n\n'))
      } else {
        console.log('No roles found for this scenario.')
      }

      // If filtering by role name, verify all returned roles match
      if (roleName) {
        result.roles.forEach((role) => {
          expect(role.name).toBe(roleName)
        })
      }

      // If filtering by target contract, verify all returned roles match
      if (targetContract) {
        result.roles.forEach((role) => {
          expect(role.targetContract.toLowerCase()).toBe(targetContract.toLowerCase())
        })
      }

      // If filtering by owner, verify all returned roles match
      if (owner) {
        result.roles.forEach((role) => {
          expect(role.owner.toLowerCase()).toBe(owner.toLowerCase())
        })
        console.log(`\n✓ All roles match owner: ${owner}`)
      }

      // Verify pagination constraints
      if (first !== undefined) {
        expect(result.roles.length).toBeLessThanOrEqual(first)
      }
    })
  })
})
