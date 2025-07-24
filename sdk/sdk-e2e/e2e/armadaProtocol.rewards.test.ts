import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'

import { SDKApiUrl, testConfig } from './utils/testConfig'
import assert from 'assert'

jest.setTimeout(300000)

describe('Armada Protocol Rewards', () => {
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  for (const { chainInfo, userAddress } of testConfig) {
    describe(`Running on ${chainInfo.name} for user ${userAddress.value}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe(`getUserMerklRewards`, () => {
        it(`should fetch Merkl rewards for the user`, async () => {
          const rewards = await sdk.armada.users.getUserMerklRewards({
            user,
            chainIds: [chainInfo.chainId],
          })

          console.log('Fetched rewards:', rewards)

          rewards.forEach((reward) => {
            expect(reward.token.chainId).toBe(chainInfo.chainId)
            expect(reward.recipient).toBe(userAddress.value)
          })
        })
      })
    })
  }
})
