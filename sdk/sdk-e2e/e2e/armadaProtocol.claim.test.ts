import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = true

describe('Armada Protocol Claim', () => {
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  for (const { chainInfo, rpcUrl, userAddress } of testConfig) {
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Running on ${chainInfo.name} for user ${userAddress.value}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe(`getAggregatedRewards`, () => {
        it(`should get aggregated rewards cross chain`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewards({
            user,
          })
          console.log('rewards', rewards)
          expect(rewards.total).toBeDefined()
          expect(rewards.total).toBeGreaterThan(0n)
          expect(rewards.vaultUsagePerChain).toBeDefined()
          expect(rewards.vaultUsage).toBeDefined()
          expect(rewards.merkleDistribution).toBeDefined()
          expect(rewards.voteDelegation).toBeGreaterThan(0n)
        })
      })

      describe(`getAggregatedRewardsIncludingMerkl`, () => {
        it(`should get aggregated rewards cross chain including merkl`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
            user,
          })
          console.log('rewards including merkl', rewards)
          expect(rewards.total).toBeDefined()
          expect(rewards.total).toBeGreaterThan(0n)
          expect(rewards.vaultUsagePerChain).toBeDefined()
          expect(rewards.vaultUsage).toBeDefined()
          expect(rewards.merkleDistribution).toBeDefined()
          expect(rewards.voteDelegation).toBeGreaterThan(0n)
        })
      })

      describe(`claimRewards`, () => {
        it.skip(`should claim rewards`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewards({
            user,
          })

          assert(rewards.total > 0n, 'Rewards should be greater than 0')

          const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
            chainInfo,
            user,
          })
          if (!tx) {
            throw new Error('No claims')
          }

          const rewardsBefore = await sdk.armada.users.getAggregatedRewards({
            user,
          })
          const toClaimBefore = rewardsBefore.total
          console.log('before', toClaimBefore)

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: tx,
            rpcUrl: rpcUrl,
            privateKey: signerPrivateKey,
            simulateOnly,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })

          const rewardsAfter = await sdk.armada.users.getAggregatedRewards({
            user,
          })
          const toClaimAfter = rewardsAfter.total
          console.log('after', toClaimAfter)
        })

        it.only(`should claim rewards including merkl`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
            user,
          })
          const toClaimBefore = rewards.total
          console.log('before', toClaimBefore)
          assert(toClaimBefore > 0n, 'Rewards should be greater than 0')

          const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
            chainInfo,
            user,
            includeMerkl: true,
          })
          if (!tx) {
            throw new Error('No claims')
          }

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: tx,
            rpcUrl: rpcUrl,
            privateKey: signerPrivateKey,
            simulateOnly,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })
          if (!simulateOnly) {
            const rewardsAfter = await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
              user,
            })
            const toClaimAfter = rewardsAfter.total
            console.log('after', toClaimAfter)

            // difference
            console.log(`Claimed rewards: ${toClaimBefore - toClaimAfter}`)
          }
        })
      })
    })
  }
})
