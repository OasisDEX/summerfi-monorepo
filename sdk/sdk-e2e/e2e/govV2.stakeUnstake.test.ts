import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, ChainConfigs } from './utils/testConfig'
import type { GovTestScenario } from './utils/types'

jest.setTimeout(300000)

const simulateOnly = false
const privateKey = SharedConfig.userPrivateKey
const oneSumr = 1n * 10n ** 18n // 1 SUMR with 18 decimals

describe('Armada Protocol Gov V2 Stake Unstake flow', () => {
  const sdk = createTestSDK()

  // Configure test scenarios here
  const scenarios: GovTestScenario[] = [
    {
      chainConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(
    scenarios.map((scenario) => {
      const chainConfig = ChainConfigs[scenario.chainConfigKey]
      return {
        chainInfo: getChainInfoByChainId(chainConfig.chainId),
        rpcUrl: chainConfig.rpcUrl,
        userAddress: Address.createFromEthereum({ value: SharedConfig.userAddressValue }),
      }
    }),
  )(
    'Running scenario on $chainInfo.name for user $userAddress.value',
    ({ chainInfo, rpcUrl, userAddress }) => {
      const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

      describe(`staking V2`, () => {
        it(`should stake 1 SUMR using V2 method`, async () => {
          const balance = await sdk.armada.users.getUserBalance({
            user,
          })
          assert(balance >= oneSumr, 'Balance should be greater than 1 SUMR')

          // const delegate = await sdk.armada.users.getUserDelegatee({
          //   user,
          // })
          // assert(delegate.value !== zeroAddress, 'Should have a delegate')

          const stakedBefore = await sdk.armada.users.getUserStakedBalance({
            user,
          })

          const stakeTxV2 = await sdk.armada.users.getStakeTxV2({
            user,
            amount: oneSumr,
          })

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: stakeTxV2,
            rpcUrl: rpcUrl,
            privateKey,
            simulateOnly,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })

          const stakedAfter = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          expect(stakedAfter).toBeGreaterThan(stakedBefore)
        })
      })

      describe(`unstaking V2`, () => {
        it(`should unstake 1 SUMR using V2 method`, async () => {
          const stakedBefore = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          assert(stakedBefore >= oneSumr, 'Staked balance should be greater than 1 SUMR')

          const unstakeTxV2 = await sdk.armada.users.getUnstakeTxV2({
            amount: oneSumr,
          })

          const { statuses } = await sendAndLogTransactions({
            chainInfo,
            transactions: unstakeTxV2,
            rpcUrl: rpcUrl,
            privateKey,
            simulateOnly,
          })
          statuses.forEach((status) => {
            expect(status).toBe('success')
          })

          const stakedAfter = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          expect(stakedAfter).toBeLessThan(stakedBefore)
        })
      })
    },
  )
})
