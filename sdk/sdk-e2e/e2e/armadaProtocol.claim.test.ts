import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)

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
          console.log(rewards)
          expect(rewards.total).toBeGreaterThan(0n)
          // expect(rewards.perChain[ChainFamilyMap.Base.Base.chainId]).toBeGreaterThan(0n)
          // expect(rewards.perChain[ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]).toBe(0n)
        })
      })

      describe.skip(`claimRewards`, () => {
        it(`should claim rewards`, async () => {
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
      })
    })
  }
})
