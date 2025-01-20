import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, testConfig } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Claim', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

  for (const { chainInfo, forkUrl, userAddress } of testConfig) {
    if (!forkUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Rewards on ${chainInfo.name} for user ${userAddress.value}`, () => {
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
          expect(rewards.perChain['8453']).toBeGreaterThan(0n)
          expect(rewards.perChain['42161']).toBe(0n)
        })
      })
    })
  }
})
