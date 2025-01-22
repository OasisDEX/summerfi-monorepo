import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { ChainFamilyMap, User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'

jest.setTimeout(300000)

describe('Armada Protocol Claim', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
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
          expect(rewards.total).toBeGreaterThan(0n)
          expect(rewards.perChain[ChainFamilyMap.Base.Base.chainId]).toBeGreaterThan(0n)
          expect(rewards.perChain[ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]).toBeGreaterThan(0n)
        })
      })

      describe(`claimRewards`, () => {
        it(`should claim rewards`, async () => {
          const rewards = await sdk.armada.users.getAggregatedRewards({
            user,
          })

          if (rewards.total > 0n) {
            const tx = await sdk.armada.users.getAggregatedClaimsForChainTX({
              chainInfo,
              user,
            })
            if (!tx) {
              throw new Error('No claims')
            }

            const rewards = await sdk.armada.users.getAggregatedRewards({
              user,
            })
            const toClaimBefore = rewards.perChain[ChainFamilyMap.Base.Base.chainId]
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
            const toClaimAfter = rewardsAfter.perChain[ChainFamilyMap.Base.Base.chainId]
            console.log('after', toClaimAfter)
          }
        })
      })
    })
  }
})
