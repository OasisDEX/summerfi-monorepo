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
import { formatSumr } from './utils/stringifiers'
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
      includeStakingV2: true,
    },
    {
      simulateOnly: true,
      chainId: ChainIds.Base,
      rpcUrl: RpcUrls.Base,
      userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' as AddressValue,
      includeMerkl: true,
      includeStakingV2: true,
    },
  ]

  const sdk = createTestSDK()

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, rpcUrl, userAddress, simulateOnly, includeMerkl, includeStakingV2 } = scenario

    const chainInfo = getChainInfoByChainId(chainId)
    const user = User.createFromEthereum(chainId, userAddress)

    const userSendTxTool = createSendTransactionTool({
      chainId,
      rpcUrl,
      signerPrivateKey: SharedConfig.userPrivateKey,
      simulateOnly,
    })

    it('should claim rewards', async () => {
      const rewards = includeMerkl
        ? await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
            user,
          })
        : await sdk.armada.users.getAggregatedRewards({
            user,
          })
      const toClaimBefore = rewards.total
      console.log(
        'before',
        Object.entries(rewards)

          .map(
            ([key, value]) =>
              `${key}: ${
                typeof value === 'bigint'
                  ? formatSumr(value)
                  : Object.entries(value)
                      .map(
                        ([subKey, subValue]) =>
                          `${subKey}: ${typeof subValue === 'bigint' ? formatSumr(subValue) : subValue}`,
                      )
                      .join(', ')
              }`,
          )
          .join(', '),
      )
      assert(toClaimBefore > 0n, 'Rewards should be greater than 0')

      const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
        chainInfo,
        user,
        includeMerkl,
        includeStakingV2,
      })
      if (!tx) {
        throw new Error('Did not return a tx even though there are rewards to claim')
      }

      const txStatus = await userSendTxTool(tx)

      if (!simulateOnly) {
        expect(txStatus).toStrictEqual(['success'])

        const rewardsAfter = includeMerkl
          ? await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
              user,
            })
          : await sdk.armada.users.getAggregatedRewards({
              user,
            })
        const toClaimAfter = rewardsAfter.total
        console.log(
          'after',
          Object.entries(rewardsAfter)
            .map(
              ([key, value]) => `${key}: ${typeof value === 'bigint' ? formatSumr(value) : value}`,
            )
            .join(', '),
        )
        console.log(`Claimed rewards: ${formatSumr(toClaimBefore - toClaimAfter)}`)
      }
    })
  })
})
