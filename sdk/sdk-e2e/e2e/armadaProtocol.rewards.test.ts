import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { type AddressValue } from '@summerfi/sdk-common'

import { SDKApiUrl } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Rewards', () => {
  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  for (const userAddress of ['0x38233654FB0843c8024527682352A5d41E7f7324'] as AddressValue[]) {
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
              console.log(`Reward ${index + 1}:`, reward)
            })
          })
        })
      })
    })
  }
})
