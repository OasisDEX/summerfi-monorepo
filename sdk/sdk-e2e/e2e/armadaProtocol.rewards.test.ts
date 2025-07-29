import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'

import { SDKApiUrl } from './utils/testConfig'

jest.setTimeout(10_000)

describe('Armada Protocol Rewards', () => {
  if (!SDKApiUrl) {
    throw new Error('E2E_SDK_API_URL environment variable not set')
  }
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  const addresses = ['0x38233654FB0843c8024527682352A5d41E7f7324'] as AddressValue[]

  for (const userAddress of addresses) {
    describe(`Running for user ${userAddress}`, () => {
      describe(`getUserMerklRewards`, () => {
        it(`should fetch Merkl rewards for the user`, async () => {
          const rewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
          })

          expect(rewards.perChain).toBeDefined()
          Object.entries(rewards.perChain).forEach(([chainId, chainRewards]) => {
            console.log(`Chain ID: ${chainId}, Rewards Count: ${chainRewards.length}`)
            chainRewards.forEach((reward, index) => {
              expect(reward).toHaveProperty('token')
              expect(reward).toHaveProperty('root')
              expect(reward).toHaveProperty('recipient')
              expect(reward).toHaveProperty('amount')
              expect(reward).toHaveProperty('claimed')
              expect(reward).toHaveProperty('pending')
              expect(reward).toHaveProperty('proofs')
              console.log(`Reward ${index + 1} is valid`)
            })
          })
        })

        it(`should fetch Merkl rewards for specific chain IDs`, async () => {
          const requestedChainIds = [ChainIds.Base]

          const rewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
            chainIds: requestedChainIds,
          })

          expect(rewards.perChain).toBeDefined()

          // Check that only requested chains are included (or chains with actual rewards)
          const returnedChainIds = Object.keys(rewards.perChain).map((chainId) => parseInt(chainId))

          // Verify that returned chains are subset of requested chains
          returnedChainIds.forEach((chainId) => {
            expect(requestedChainIds).toContain(chainId)
          })

          // Log rewards for each requested chain
          requestedChainIds.forEach((chainId) => {
            const chainRewards = rewards.perChain[chainId]
            if (chainRewards && chainRewards.length > 0) {
              console.log(`Chain ID ${chainId}: ${chainRewards.length} rewards found`)
              chainRewards.forEach((reward, index) => {
                console.log(`  Reward ${index + 1}: ${reward.token.symbol} - ${reward.amount}`)
              })
            } else {
              console.log(`Chain ID ${chainId}: No rewards found`)
            }
          })
        })
      })

      describe(`getUserMerklClaimTx`, () => {
        it(`should generate claim transaction for user with rewards`, async () => {
          // First get rewards to find chains with rewards
          const rewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
          })

          const allChainIds = [
            ChainIds.Mainnet,
            ChainIds.Optimism,
            ChainIds.Base,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[] // Ethereum, Optimism, Base, Arbitrum, Sonic
          const chainsWithRewards = Object.entries(rewards.perChain)
            .filter(([_, chainRewards]) => chainRewards && chainRewards.length > 0)
            .map(([chainId]) => parseInt(chainId) as ChainId)

          const chainsWithoutRewards = allChainIds.filter(
            (chainId) => !chainsWithRewards.includes(chainId),
          )

          console.log(`Chains with rewards: ${chainsWithRewards}`)
          console.log(`Chains without rewards: ${chainsWithoutRewards}`)

          // Test chains WITH rewards - should return transaction array
          for (const chainId of chainsWithRewards) {
            console.log(`Testing chain ${chainId} (has rewards)`)
            const claimTransactions = await sdk.armada.users.getUserMerklClaimTx({
              address: userAddress,
              chainId,
            })

            expect(claimTransactions).toBeDefined()
            expect(claimTransactions).not.toBeUndefined()
            expect(Array.isArray(claimTransactions)).toBe(true)
            expect(claimTransactions!.length).toBe(1)

            const claimTx = claimTransactions![0]
            expect(claimTx.type).toBe('MerklClaim')
            expect(claimTx.description).toBe('Claiming Merkle rewards')
            expect(claimTx.transaction).toBeDefined()
            expect(claimTx.transaction.target).toBeDefined()
            expect(claimTx.transaction.calldata).toBeDefined()
            expect(claimTx.transaction.value).toBe('0')

            console.log(`✅ Generated claim transaction for chain ${chainId}`)
            break // No need to test further chains with rewards
          }

          // Test chains WITHOUT rewards - should return undefined
          for (const chainId of chainsWithoutRewards) {
            console.log(`Testing chain ${chainId} (no rewards)`)
            const result = await sdk.armada.users.getUserMerklClaimTx({
              address: userAddress,
              chainId,
            })

            expect(result).toBeUndefined()
            console.log(`✅ Chain ${chainId} correctly returned undefined (no rewards)`)
            break // No need to test further chains without rewards
          }

          // Ensure we tested at least one scenario
          if (chainsWithRewards.length === 0 && chainsWithoutRewards.length === 0) {
            throw new Error('Nothing was tested - no chains with or without rewards found')
          }
        })

        it(`should throw error for unsupported chain`, async () => {
          const unsupportedChainId = 999999 as ChainId

          await expect(
            sdk.armada.users.getUserMerklClaimTx({
              address: userAddress,
              chainId: unsupportedChainId,
            }),
          ).rejects.toThrow()
        })
      })

      describe(`authorizeAsMerklRewardsOperatorTx`, () => {
        it(`should generate authorization transaction for supported chains`, async () => {
          const supportedChainIds = [
            ChainIds.Mainnet,
            ChainIds.Base,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[]

          for (const chainId of supportedChainIds) {
            console.log(`Testing authorization transaction for chain ${chainId}`)

            const authTransactions = await sdk.armada.users.authorizeAsMerklRewardsOperatorTx({
              chainId,
              user: userAddress,
            })

            expect(authTransactions).toBeDefined()
            expect(Array.isArray(authTransactions)).toBe(true)
            expect(authTransactions.length).toBe(1)

            const authTx = authTransactions[0]
            expect(authTx.type).toBe('ToggleAQasMerklRewardsOperator')
            expect(authTx.description).toBe('Authorize AdmiralsQuarters as Merkl rewards operator')
            expect(authTx.transaction).toBeDefined()
            expect(authTx.transaction.target).toBeDefined()
            expect(authTx.transaction.calldata).toBeDefined()
            expect(authTx.transaction.value).toBe('0')

            console.log(`✅ Generated authorization transaction for chain ${chainId}`)
            break // Test one chain to avoid rate limits
          }
        })

        it(`should throw error for unsupported chain`, async () => {
          const unsupportedChainId = 999999 as ChainId

          await expect(
            sdk.armada.users.authorizeAsMerklRewardsOperatorTx({
              chainId: unsupportedChainId,
              user: userAddress,
            }),
          ).rejects.toThrow()
        })
      })

      describe(`isAuthorizedAsMerklRewardsOperatorTx`, () => {
        it(`should check authorization status for supported chains`, async () => {
          const supportedChainIds = [
            ChainIds.Mainnet,
            ChainIds.Base,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[]

          for (const chainId of supportedChainIds) {
            console.log(`Testing authorization status for chain ${chainId}`)

            const isAuthorized = await sdk.armada.users.isAuthorizedAsMerklRewardsOperatorTx({
              chainId,
              user: userAddress,
            })

            expect(typeof isAuthorized).toBe('boolean')
            console.log(`✅ Authorization status for chain ${chainId}: ${isAuthorized}`)
            break // Test one chain to avoid rate limits
          }
        })

        it(`should return false for unauthorized user`, async () => {
          const unauthorizedUser = '0x0000000000000000000000000000000000000001' as AddressValue
          const testChainId = ChainIds.Base

          const isAuthorized = await sdk.armada.users.isAuthorizedAsMerklRewardsOperatorTx({
            chainId: testChainId,
            user: unauthorizedUser,
          })

          expect(typeof isAuthorized).toBe('boolean')
          expect(isAuthorized).toBe(false)
          console.log(`✅ Unauthorized user correctly returned false`)
        })

        it(`should throw error for unsupported chain`, async () => {
          const unsupportedChainId = 999999 as ChainId

          await expect(
            sdk.armada.users.isAuthorizedAsMerklRewardsOperatorTx({
              chainId: unsupportedChainId,
              user: userAddress,
            }),
          ).rejects.toThrow('Unsupported chain ID for Merkl operations')
        })
      })

      describe(`Merkl Rewards Operator Authorization Flow`, () => {
        it(`should demonstrate full authorization flow`, async () => {
          const testChainId = ChainIds.Base

          // Step 1: Check initial authorization status
          console.log('Step 1: Checking initial authorization status...')
          const initialAuthStatus = await sdk.armada.users.isAuthorizedAsMerklRewardsOperatorTx({
            chainId: testChainId,
            user: userAddress,
          })
          console.log(`Initial authorization status: ${initialAuthStatus}`)

          // Step 2: Generate authorization transaction
          console.log('Step 2: Generating authorization transaction...')
          const authTransactions = await sdk.armada.users.authorizeAsMerklRewardsOperatorTx({
            chainId: testChainId,
            user: userAddress,
          })

          expect(authTransactions).toBeDefined()
          expect(authTransactions.length).toBe(1)
          console.log(`✅ Authorization transaction generated successfully`)

          // Step 3: Verify transaction structure
          const authTx = authTransactions[0]
          expect(authTx.type).toBe('ToggleAQasMerklRewardsOperator')
          expect(authTx.transaction.target).toBeDefined()
          expect(authTx.transaction.calldata).toBeDefined()

          console.log(`✅ Full authorization flow test completed`)
        })
      })
    })
  }
})
