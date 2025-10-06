import { type SDKManager } from '@summerfi/sdk-client'
import { ChainIds, getChainInfoByChainId, User, type AddressValue } from '@summerfi/sdk-common'

import { RpcUrls, signerPrivateKey, e2eWalletAddress } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = true

const config = [
  {
    chainId: ChainIds.Sonic,
    rpcUrl: RpcUrls.Sonic,
    userAddress: '0x10649c79428d718621821Cf6299e91920284743F' as AddressValue,
  },
]

describe('Armada Protocol Claim', () => {
  const sdk: SDKManager = createTestSDK()

  for (const { chainId, rpcUrl, userAddress } of config) {
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }
    const chainInfo = getChainInfoByChainId(chainId)

    describe(`Running on ${chainInfo.name} for user ${userAddress}`, () => {
      const user = User.createFromEthereum(chainId, userAddress)

      describe(`getAggregatedRewards`, () => {
        it.skip(`should get aggregated rewards cross chain`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewards({
            user,
          })
          console.log('rewards', rewards)
          expect(rewards.total).toBeDefined()
          expect(rewards.total).toBeGreaterThan(0n)
          expect(rewards.vaultUsagePerChain).toBeDefined()
          expect(rewards.vaultUsage).toBeDefined()
          expect(rewards.merkleDistribution).toBeDefined()
          expect(rewards.voteDelegation).toBeDefined()
        })

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
          expect(rewards.voteDelegation).toBeDefined()
        })
      })

      describe(`claimRewards`, () => {
        it.skip(`should claim rewards`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewards({
            user,
          })
          const toClaimBefore = rewards.total
          console.log('before', toClaimBefore)
          assert(toClaimBefore > 0n, 'Rewards should be greater than 0')

          const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
            chainInfo,
            user,
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
            // Check rewards after claiminge
            const rewardsAfter = await sdk.armada.users.getAggregatedRewards({
              user,
            })
            const toClaimAfter = rewardsAfter.total
            console.log('after', toClaimAfter)
          }
        })

        it(`should claim rewards including merkl`, async () => {
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
