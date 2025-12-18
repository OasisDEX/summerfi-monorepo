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
    expectedMinimumCount?: number
  }[] = [
    {
      expectedMinimumCount: 0,
    },
    {
      roleName: GraphRoleName.WHITELIST_ROLE,
      expectedMinimumCount: 0,
    },
    {
      targetContract: 'fleetAddress',
      expectedMinimumCount: 0,
    },
    {
      targetContract: 'aqAddress',
      expectedMinimumCount: 0,
    },
    {
      roleName: GraphRoleName.WHITELIST_ROLE,
      targetContract: 'fleetAddress',
      expectedMinimumCount: 0,
    },
    {
      first: 5,
      expectedMinimumCount: 0,
    },
    {
      skip: 2,
      first: 3,
      expectedMinimumCount: 0,
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const {
      roleName,
      targetContract: targetContractKey,
      owner,
      first,
      skip,
      expectedMinimumCount = 0,
    } = scenario

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
        'Running test with ' +
          (targetContractKey ? `targetContract: ${targetContract}` : 'no targetContract'),
        roleName ? `, roleName: ${roleName}` : '',
        owner ? `, owner: ${owner}` : '',
        first ? `, first: ${first}` : '',
        skip ? `, skip: ${skip}` : '',
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

      console.log(`Found ${result.roles.length} role(s)`)

      // Verify minimum count expectation
      expect(result.roles.length).toBeGreaterThanOrEqual(expectedMinimumCount)

      // Log details about the roles found
      if (result.roles.length > 0) {
        console.log('\nRole details:')
        result.roles.forEach((role, index) => {
          console.log(`\n[${index + 1}] Role:`)
          console.log(`  ID: ${role.id}`)
          console.log(`  Name: ${role.name}`)
          console.log(`  Owner: ${role.owner}`)
          console.log(`  Target Contract: ${role.targetContract}`)
          console.log(`  Institution ID: ${role.institution.id}`)

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
        })
      }

      // If filtering by role name, verify all returned roles match
      if (roleName) {
        result.roles.forEach((role) => {
          expect(role.name).toBe(roleName)
        })
        console.log(`\n✓ All roles match filter: ${roleName}`)
      }

      // If filtering by target contract, verify all returned roles match
      if (targetContract) {
        result.roles.forEach((role) => {
          expect(role.targetContract.toLowerCase()).toBe(targetContract.toLowerCase())
        })
        console.log(`\n✓ All roles match target contract: ${targetContract}`)
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
        console.log(`\n✓ Result respects pagination limit: ${first}`)
      }
    })
  })

  it('should handle combined filters', async () => {
    console.log('\n=== Testing combined filters ===')

    const { sdk, chainId, aqAddress } = createAdminSdkTestSetup(TestClientIds.ACME)

    const result = await sdk.armada.accessControl.getAllRoles({
      chainId,
      name: GraphRoleName.WHITELIST_ROLE,
      targetContract: aqAddress.value,
      first: 10,
    })

    expect(result).toBeDefined()
    expect(result.roles).toBeDefined()
    expect(Array.isArray(result.roles)).toBe(true)

    console.log(`Found ${result.roles.length} WHITELIST_ROLE(s) for contract ${aqAddress.value}`)

    // Verify all results match both filters
    result.roles.forEach((role) => {
      expect(role.name).toBe(GraphRoleName.WHITELIST_ROLE)
      expect(role.targetContract.toLowerCase()).toBe(aqAddress.value.toLowerCase())
    })

    if (result.roles.length > 0) {
      console.log('\n✓ All roles match combined filters')
      console.log(`  - Role name: ${GraphRoleName.WHITELIST_ROLE}`)
      console.log(`  - Target contract: ${aqAddress.value}`)
    }

    console.log('\n=== Combined filters test completed ===\n')
  })
})
