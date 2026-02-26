import {
  type ChainId,
  ChainIds,
  getChainInfoByChainId,
  User,
  type AddressValue,
  type HexData,
} from '@summerfi/sdk-common'
import { RpcUrls } from './utils/testConfig'
import { createTestSdkInstance } from './utils/createTestSdkInstance'
import { createSendTransactionTool } from '@summerfi/testing-utils'
import { formatSumr } from './utils/stringifiers'
import assert from 'assert'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Claim Rewards', () => {
  const scenarios: {
    chainId: ChainId
    userAddress: AddressValue
    signerPrivateKey?: HexData
    simulateOnly?: boolean
    includeMerkl?: boolean
    includeStakingV2?: boolean
  }[] = [
    {
      chainId: ChainIds.Mainnet,
      userAddress: '0x10649c79428d718621821Cf6299e91920284743F',
      // userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
      includeMerkl: false,
      includeStakingV2: true,
      simulateOnly: true,
    },
  ]

  const sdk = createTestSdkInstance()

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { chainId, userAddress, signerPrivateKey, simulateOnly, includeMerkl, includeStakingV2 } =
      scenario

    const chainInfo = getChainInfoByChainId(chainId)
    const user = User.createFromEthereum(chainId, userAddress)
    const userSendTxTool = createSendTransactionTool({
      chainId,
      rpcUrl: RpcUrls[chainId],
      senderAddress: userAddress,
      signerPrivateKey,
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
      const toClaimBefore =
        includeStakingV2 && chainId === ChainIds.Base
          ? rewards.total
          : rewards.total - rewards.stakingV2
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
      assert(toClaimBefore > 0n, 'Nothing to claim, cannot test claiming rewards')

      const tx = await sdk.armada.users.getAggregatedClaimsForChainTx({
        chainInfo,
        user,
        includeMerkl,
        includeStakingV2,
      })
      if (!tx) {
        throw new Error('Did not return a tx even though there are rewards to claim')
      }

      // Send transactions
      const txStatus = await userSendTxTool(tx)

      // Verify results
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
