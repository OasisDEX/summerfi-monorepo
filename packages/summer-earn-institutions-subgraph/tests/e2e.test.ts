import {
  getAllRoles,
  getRolesByName,
  getRolesByOwner,
  getRolesByTargetContract,
  getRolesByInstitution,
  getRolesByInstitutionAndOwner,
  getRolesByInstitutionAndTargetContract,
  getRolesByInstitutionAndName,
  getInstitutions,
  getVaults,
  getUsers,
  getHistoricalVaults,
  getInstitutionById,
  getInstitutionVaults,
} from '../src'
import { SubgraphClientConfig } from '../src/types'

import { ChainId } from '@summerfi/serverless-shared'

// Test configuration - using mainnet as it's most likely to have data
const testConfig: SubgraphClientConfig = {
  chainId: ChainId.BASE,
  urlBase: 'https://subgraph.staging.oasisapp.dev',
}

// Timeout for network requests
const NETWORK_TIMEOUT = 300000

describe('Summer Earn Institutions Subgraph E2E Tests', () => {
  describe('Institution Queries', () => {
    test(
      'should fetch institutions',
      async () => {
        const institutions = await getInstitutions(testConfig)

        expect(Array.isArray(institutions.institutions)).toBe(true)
        console.log(`Found ${institutions.institutions.length} institutions`)

        if (institutions.institutions.length > 0) {
          const institution = institutions.institutions[0]
          expect(institution).toHaveProperty('id')
          expect(institution).toHaveProperty('protocolAccessManager')
          expect(institution).toHaveProperty('harborCommand')
          expect(institution).toHaveProperty('configurationManager')
          expect(Array.isArray(institution.vaults)).toBe(true)
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch institution by ID',
      async () => {
        // First get institutions to have a valid ID
        const institutions = await getInstitutions(testConfig)

        if (institutions.institutions.length > 0) {
          const institutionId = institutions.institutions[0].id
          const institution = await getInstitutionById({ id: institutionId }, testConfig)

          expect(institution.institution).toBeTruthy()
          expect(institution.institution?.id).toBe(institutionId)
          expect(institution.institution).toHaveProperty('protocolAccessManager')
          expect(institution.institution).toHaveProperty('harborCommand')
          expect(institution.institution).toHaveProperty('configurationManager')
          expect(Array.isArray(institution.institution?.vaults)).toBe(true)
        } else {
          console.log('No institutions found, skipping institution by ID test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch institution vaults',
      async () => {
        const institutions = await getInstitutions(testConfig)

        if (institutions.institutions.length > 0) {
          const institutionId = institutions.institutions[0].id
          const result = await getInstitutionVaults({ id: institutionId }, testConfig)

          expect(result.institution).toBeTruthy()
          expect(Array.isArray(result.institution?.vaults)).toBe(true)

          if (result.institution?.vaults && result.institution.vaults.length > 0) {
            const vault = result.institution.vaults[0]
            expect(vault).toHaveProperty('id')
            expect(vault).toHaveProperty('name')
            expect(vault).toHaveProperty('totalValueLockedUSD')
            expect(Array.isArray(vault.arks)).toBe(true)
          }
        } else {
          console.log('No institutions found, skipping institution vaults test')
        }
      },
      NETWORK_TIMEOUT,
    )
  })

  describe('Role Queries', () => {
    test(
      'should fetch roles by owner',
      async () => {
        // First get all roles to find a valid owner
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const ownerAddress = allRoles[0].owner
          const roles = await getRolesByOwner({ owner: ownerAddress }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(`Found ${roles.length} roles for owner ${ownerAddress}`)

          // All returned roles should have the same owner
          roles.forEach((role) => {
            expect(role.owner).toBe(ownerAddress)
          })
        } else {
          console.log('No roles found, skipping roles by owner test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by target contract',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const targetContract = allRoles[0].targetContract
          const roles = await getRolesByTargetContract({ targetContract }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(`Found ${roles.length} roles for target contract ${targetContract}`)

          // All returned roles should have the same target contract
          roles.forEach((role) => {
            expect(role.targetContract).toBe(targetContract)
          })
        } else {
          console.log('No roles found, skipping roles by target contract test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by name',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const roleName = allRoles[0].name
          const roles = await getRolesByName({ name: roleName }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(`Found ${roles.length} roles with name ${roleName}`)

          // All returned roles should have the same name
          roles.forEach((role) => {
            expect(role.name).toBe(roleName)
          })
        } else {
          console.log('No roles found, skipping roles by name test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by institution',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const institutionId = allRoles[0].institution.id
          const roles = await getRolesByInstitution({ institutionId }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(`Found ${roles.length} roles for institution ${institutionId}`)

          // All returned roles should belong to the same institution
          roles.forEach((role) => {
            expect(role.institution.id).toBe(institutionId)
          })
        } else {
          console.log('No roles found, skipping roles by institution test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by institution and owner',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const institutionId = allRoles[0].institution.id
          const owner = allRoles[0].owner
          const roles = await getRolesByInstitutionAndOwner({ institutionId, owner }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(
            `Found ${roles.length} roles for institution ${institutionId} and owner ${owner}`,
          )

          // All returned roles should match both criteria
          roles.forEach((role) => {
            expect(role.institution.id).toBe(institutionId)
            expect(role.owner).toBe(owner)
          })
        } else {
          console.log('No roles found, skipping roles by institution and owner test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by institution and target contract',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const institutionId = allRoles[0].institution.id
          const targetContract = allRoles[0].targetContract
          const roles = await getRolesByInstitutionAndTargetContract(
            { institutionId, targetContract },
            testConfig,
          )

          expect(Array.isArray(roles)).toBe(true)
          console.log(
            `Found ${roles.length} roles for institution ${institutionId} and target contract ${targetContract}`,
          )

          // All returned roles should match both criteria
          roles.forEach((role) => {
            expect(role.institution.id).toBe(institutionId)
            expect(role.targetContract).toBe(targetContract)
          })
        } else {
          console.log('No roles found, skipping roles by institution and target contract test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch roles by institution and name',
      async () => {
        const allRoles = await getAllRoles(testConfig)

        if (allRoles.length > 0) {
          const institutionId = allRoles[0].institution.id
          const name = allRoles[0].name
          const roles = await getRolesByInstitutionAndName({ institutionId, name }, testConfig)

          expect(Array.isArray(roles)).toBe(true)
          console.log(
            `Found ${roles.length} roles for institution ${institutionId} and name ${name}`,
          )

          // All returned roles should match both criteria
          roles.forEach((role) => {
            expect(role.institution.id).toBe(institutionId)
            expect(role.name).toBe(name)
          })
        } else {
          console.log('No roles found, skipping roles by institution and name test')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch all roles with pagination',
      async () => {
        const roles = await getAllRoles(testConfig)
        expect(Array.isArray(roles)).toBe(true)
        console.log(`Found ${roles.length} total roles`)

        if (roles.length > 0) {
          const role = roles[0]
          expect(role).toHaveProperty('id')
          expect(role).toHaveProperty('owner')
          expect(role).toHaveProperty('name')
          expect(role).toHaveProperty('accessController')
          expect(role).toHaveProperty('targetContract')
          expect(role).toHaveProperty('institution')
          expect(role.institution).toHaveProperty('id')
        }
      },
      NETWORK_TIMEOUT,
    )
  })

  describe('Vault and User Queries', () => {
    test(
      'should fetch vaults',
      async () => {
        const result = await getVaults(testConfig)

        expect(Array.isArray(result.vaults)).toBe(true)
        console.log(`Found ${result.vaults.length} vaults`)

        if (result.vaults.length > 0) {
          const vault = result.vaults[0]
          expect(vault).toHaveProperty('id')
          expect(vault).toHaveProperty('name')
          expect(vault).toHaveProperty('totalValueLockedUSD')
          expect(Array.isArray(vault.arks)).toBe(true)
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch users with pagination',
      async () => {
        const result = await getUsers({ first: 10, skip: 0 }, testConfig)

        expect(Array.isArray(result.accounts)).toBe(true)
        console.log(`Found ${result.accounts.length} users`)

        if (result.accounts.length > 0) {
          const user = result.accounts[0]
          expect(user).toHaveProperty('id')
          expect(user).toHaveProperty('claimedSummerTokenNormalized')
        }
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should fetch historical vaults',
      async () => {
        // Use a recent block number (you might want to adjust this)
        const blockNumber = 37260602 // Approximate recent block
        const result = await getHistoricalVaults({ blockNumber }, testConfig)

        expect(Array.isArray(result.vaults)).toBe(true)
        console.log(`Found ${result.vaults.length} historical vaults at block ${blockNumber}`)

        if (result.vaults.length > 0) {
          const vault = result.vaults[0]
          expect(vault).toHaveProperty('id')
          expect(vault).toHaveProperty('name')
          expect(vault).toHaveProperty('totalValueLockedUSD')
          expect(Array.isArray(vault.arks)).toBe(true)
        }
      },
      NETWORK_TIMEOUT,
    )
  })

  describe('Error Handling', () => {
    test(
      'should handle invalid chain ID gracefully',
      async () => {
        const invalidConfig: SubgraphClientConfig = {
          chainId: 999999 as ChainId, // Invalid chain ID
          urlBase: 'https://api.thegraph.com/subgraphs/name/summerfi',
        }

        await expect(getAllRoles(invalidConfig)).rejects.toThrow()
      },
      NETWORK_TIMEOUT,
    )

    test(
      'should handle network errors gracefully',
      async () => {
        const invalidConfig: SubgraphClientConfig = {
          chainId: ChainId.MAINNET,
          urlBase: 'https://invalid-url-that-does-not-exist.com',
        }

        await expect(getAllRoles(invalidConfig)).rejects.toThrow()
      },
      NETWORK_TIMEOUT,
    )
  })
})

describe('Pagination Helper Integration', () => {
  test(
    'should handle large datasets with pagination',
    async () => {
      const roles = await getAllRoles(testConfig)

      // Test that pagination works by checking if we get results
      expect(Array.isArray(roles)).toBe(true)
      console.log(`Pagination test: Retrieved ${roles.length} total roles`)

      // If we have more than 1000 roles, pagination was used
      if (roles.length > 1000) {
        console.log('✅ Pagination was successfully used to retrieve > 1000 roles')
      }

      // Verify all roles have unique IDs (pagination should not duplicate)
      const roleIds = roles.map((role) => role.id)
      const uniqueIds = new Set(roleIds)
      expect(uniqueIds.size).toBe(roleIds.length)
    },
    NETWORK_TIMEOUT,
  )
})
