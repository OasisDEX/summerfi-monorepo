import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey } from './utils/testConfig'
import assert from 'node:assert'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'
import { BigNumber } from 'bignumber.js'

const onlySimulation = true // Set to false to actually send transactions

const addresses = [
  '0x805769AA22219E3a29b301Ab5897B903A9ad2C4A',
  // '0x38233654FB0843c8024527682352A5d41E7f7324',
  // '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  // '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d',
  // '0xE9c245293DAC615c11A5bF26FCec91C3617645E4',
] as AddressValue[]

describe('Armada Protocol Rewards', () => {
  const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
  if (!rpcUrl) {
    throw new Error('E2E_SDK_FORK_URL_BASE environment variable not set')
  }

  if (!SDKApiUrl) {
    throw new Error('E2E_SDK_API_URL environment variable not set')
  }
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  let sendTxTool: SendTransactionTool

  for (const userAddress of addresses) {
    describe(`Running for user ${userAddress}`, () => {
      describe(`getUserMerklRewards`, () => {
        it.skip(`should fetch Merkl rewards for the user`, async () => {
          const rewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
          })

          expect(rewards.perChain).toBeDefined()
          Object.entries(rewards.perChain).forEach(([chainId, chainRewards]) => {
            console.log(
              `Validating rewards on Chain ID: ${chainId}, Rewards Count: ${chainRewards.length}`,
            )
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

        it.skip(`should fetch Merkl rewards for specific chain IDs`, async () => {
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
                console.log(
                  `  Reward ${index + 1}: ${reward.token.symbol} - ${displayReward(reward)}`,
                )
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
            ChainIds.Base,
            ChainIds.Mainnet,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[] // Ethereum, Base, Arbitrum, Sonic
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
            if (!claimTransactions) {
              console.log(`No claim transactions generated for chain ${chainId}`)
              continue // Skip to next chain
            }

            expect(claimTransactions).toBeDefined()
            expect(claimTransactions).not.toBeUndefined()
            expect(Array.isArray(claimTransactions)).toBe(true)
            expect(claimTransactions!.length).toBe(1)

            const claimTx = claimTransactions![0]
            expect(claimTx.type).toBe('MerklClaim')
            expect(claimTx.description).toContain('Claiming Merkl rewards')
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

      describe.skip(`getReferralFeesMerklClaimTx`, () => {
        it(`should generate referral claim transaction with specific token addresses`, async () => {
          const usdcToken = await sdk.tokens.getTokenBySymbol({
            symbol: 'USDC',
            chainId: ChainIds.Base,
          })
          const usdcTokenAddress = usdcToken.address.value

          const feeUserAddress = '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d'

          // First get rewards to find chains with rewards and get token addresses
          const rewards = await sdk.armada.users.getUserMerklRewards({
            address: feeUserAddress,
            chainIds: [ChainIds.Base],
            rewardsTokensAddresses: [usdcTokenAddress],
          })

          const chainsWithRewards = Object.entries(rewards.perChain)
            .filter(([_, chainRewards]) => chainRewards && chainRewards.length > 0)
            .map(([chainId]) => parseInt(chainId) as ChainId)

          if (chainsWithRewards.length === 0) {
            console.log('No chains with rewards found, skipping token-specific test')
            return
          }

          const testChainId = chainsWithRewards[0]
          const chainRewards = rewards.perChain[testChainId]
          if (!chainRewards || chainRewards.length === 0) {
            console.log('No rewards found on test chain, skipping token-specific test')
            return
          }

          console.log(
            `Testing referral claim transaction for chain ${testChainId} and token ${chainRewards[0].token.address} with ${chainRewards[0].amount} ${chainRewards[0].token.symbol}`,
          )

          const claimTransactions = await sdk.armada.users.getReferralFeesMerklClaimTx({
            address: feeUserAddress,
            chainId: testChainId,
            rewardsTokensAddresses: [chainRewards[0].token.address as AddressValue],
          })

          if (!claimTransactions) {
            console.log(`No referral claim transactions generated with specific tokens`)
            return
          }

          expect(claimTransactions).toBeDefined()
          expect(Array.isArray(claimTransactions)).toBe(true)
          expect(claimTransactions.length).toBe(1)

          const claimTx = claimTransactions[0]
          expect(claimTx.type).toBe('MerklClaim')
          expect(claimTx.description).toContain('Claiming Merkl rewards')
          expect(claimTx.transaction).toBeDefined()
          expect(claimTx.transaction.target).toBeDefined()
          expect(claimTx.transaction.calldata).toBeDefined()
          expect(claimTx.transaction.value).toBe('0')

          console.log(
            `✅ Generated referral claim transaction with specific tokens for chain ${testChainId}`,
          )

          // try to send tx
          sendTxTool = createSendTransactionTool({
            chainId: testChainId,
            rpcUrl,
            signerPrivateKey: signerPrivateKey,
            onlySimulation,
          })

          const status = await sendTxTool(claimTx)
          console.log(`✅ Sent referral claim transaction for chain ${testChainId}: ${status}`)
        })

        it(`should throw error for unsupported chain`, async () => {
          const unsupportedChainId = 999999 as ChainId

          await expect(
            sdk.armada.users.getReferralFeesMerklClaimTx({
              address: userAddress,
              chainId: unsupportedChainId,
            }),
          ).rejects.toThrow()
        })
      })

      describe.skip(`getAuthorizeAsMerklRewardsOperatorTx`, () => {
        it(`should generate authorization transaction for supported chains`, async () => {
          const supportedChainIds = [
            ChainIds.Base,
            ChainIds.Mainnet,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[]

          for (const chainId of supportedChainIds) {
            console.log(`Testing authorization transaction for chain ${chainId}`)

            const authTransactions = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
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
            sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
              chainId: unsupportedChainId,
              user: userAddress,
            }),
          ).rejects.toThrow()
        })
      })

      describe.skip(`getIsAuthorizedAsMerklRewardsOperator`, () => {
        it(`should check authorization status for supported chains`, async () => {
          const supportedChainIds = [
            ChainIds.Base,
            ChainIds.Mainnet,
            ChainIds.ArbitrumOne,
            ChainIds.Sonic,
          ] as ChainId[]

          for (const chainId of supportedChainIds) {
            console.log(`Testing authorization status for chain ${chainId}`)

            const isAuthorized = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
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

          const isAuthorized = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
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
            sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
              chainId: unsupportedChainId,
              user: userAddress,
            }),
          ).rejects.toThrow()
        })
      })

      describe.skip(`User Flow`, () => {
        test(`should demonstrate full claiming flow on base`, async () => {
          const testChainId = ChainIds.Base

          sendTxTool = createSendTransactionTool({
            chainId: testChainId,
            rpcUrl,
            signerPrivateKey: signerPrivateKey,
          })

          console.log(`Step 0: Checking user rewards on chain ${testChainId}...`)
          const userRewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
            chainIds: [testChainId],
          })

          if (
            !userRewards.perChain[testChainId] ||
            userRewards.perChain[testChainId].length === 0
          ) {
            console.log(`No rewards found for user on chain ${testChainId}. Skipping flow.`)
            return
          } else {
            console.log(
              `User rewards on chain ${testChainId}:`,
              userRewards.perChain[testChainId].map((reward) => ({
                token: reward.token.symbol,
                amount: reward.amount,
                claimed: reward.claimed,
              })),
            )
          }

          console.log('Step 1: Checking operator authorization status...')
          const initialAuthStatus = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
            chainId: testChainId,
            user: userAddress,
          })
          console.log(`Operator authorization status: ${initialAuthStatus}`)

          // Step 2: Generate authorization transaction if needed
          console.log('Step 2: Generating authorization transaction if needed...')
          if (initialAuthStatus) {
            console.log(
              `User is already authorized on chain ${testChainId}. Skipping authorization.`,
            )
          } else {
            console.log(
              `User is not authorized on chain ${testChainId}. Generating authorization transaction...`,
            )

            const authTransactions = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
              chainId: testChainId,
              user: userAddress,
            })
            assert(authTransactions[0], 'No authorization transaction Generated')

            const status = await sendTxTool(authTransactions[0])
            assert(status === 'success', 'Authorization transaction failed')

            console.log(`Checking authorization status after sending transaction...`)
            const postAuthStatus = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
              chainId: testChainId,
              user: userAddress,
            })
            console.log(`Post-authorization status: ${postAuthStatus}`)
            if (!postAuthStatus) {
              throw new Error(
                `User is still not authorized on chain ${testChainId} after sending transaction`,
              )
            } else {
              console.log(`User is now authorized on chain ${testChainId}`)
            }
          }

          console.log('Step 4: Generating and sending claim transaction...')
          const claimTransactions = await sdk.armada.users.getUserMerklClaimTx({
            address: userAddress,
            chainId: testChainId,
          })
          if (!claimTransactions) {
            throw new Error(`No claim transactions generated`)
          } else {
            console.log(`Claim transaction generated: ${claimTransactions[0].description}`)

            const claimTxStatus = await sendTxTool(claimTransactions[0])
            assert(claimTxStatus === 'success', 'Claim transaction failed')
          }

          console.log('Step 5: Verifying claim is successful by checking rewards again...')
          const updatedRewards = await sdk.armada.users.getUserMerklRewards({
            address: userAddress,
            chainIds: [testChainId],
          })
          const updatedChainRewards = updatedRewards.perChain[testChainId]
          if (!updatedChainRewards || updatedChainRewards.length === 0) {
            throw new Error(`No updated rewards found for user on chain ${testChainId}`)
          }
          console.log(
            `Updated rewards on chain ${testChainId}:`,
            updatedChainRewards.map((reward) => ({
              token: reward.token.symbol,
              amount: reward.amount,
              claimed: reward.claimed,
            })),
          )

          console.log(`✅ Full authorization flow test completed successfully`)
        }, 60_000)
      })
    })
  }
})

function displayReward(reward: {
  amount: string
  claimed: string
  token: { decimals: number }
}): string {
  return BigNumber(reward.amount)
    .minus(reward.claimed)
    .div(10 ** Number(reward.token.decimals))
    .toString()
}
