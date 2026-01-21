import {
  type ChainId,
  ChainIds,
  getChainInfoByChainId,
  User,
  type AddressValue,
} from '@summerfi/sdk-common'
import { RpcUrls, SharedConfig } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { createSendTransactionTool } from '@summerfi/testing-utils'
import assert from 'assert'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Claim Rewards', () => {
  const scenarios: {
    simulateOnly: boolean
    chainId: ChainId
    rpcUrl: string
    userAddress: AddressValue
    includeMerkl?: boolean
    includeStakingV2?: boolean
  }[] = [
    {
      simulateOnly: true,
      chainId: ChainIds.Base,
      rpcUrl: RpcUrls.Base,
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' as AddressValue,
      includeMerkl: false,
      includeStakingV2: false,
    },
  ]

  const sdk = createTestSDK()

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, rpcUrl, userAddress, simulateOnly, includeMerkl, includeStakingV2 } = scenario

    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    const chainInfo = getChainInfoByChainId(chainId)
    const user = User.createFromEthereum(chainId, userAddress)

    const userSendTxTool = createSendTransactionTool({
      chainId,
      rpcUrl,
      signerPrivateKey: SharedConfig.userPrivateKey,
      simulateOnly,
    })

    it('should claim rewards', async () => {
      const getRewards = includeMerkl
        ? sdk.armada.users.getAggregatedRewardsIncludingMerkl
        : sdk.armada.users.getAggregatedRewards

      const rewards = await getRewards({
        user,
      })
      const toClaimBefore = rewards.total
      console.log('before', toClaimBefore)
      assert(toClaimBefore > 0n, 'Rewards should be greater than 0')

      const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
        chainInfo,
        user,
        includeMerkl,
        includeStakingV2,
      })
      if (!tx) {
        throw new Error('No claims')
      }

      const txStatus = await userSendTxTool(tx)
      expect(txStatus).toBe('success')

      if (!simulateOnly) {
        const rewardsAfter = await getRewards({
          user,
        })
        const toClaimAfter = rewardsAfter.total
        console.log('after', toClaimAfter)
        console.log(`Claimed rewards: ${toClaimBefore - toClaimAfter}`)
      }
    })
  })
})
