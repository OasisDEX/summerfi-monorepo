import { User, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

const simulateOnly = false
const privateKey = SharedConfig.userPrivateKey
const oneSumr = 1n * 10n ** 18n // 1 SUMR with 18 decimals

describe('Armada Protocol Gov V2 Stake Unstake flow', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario

    it('should stake 1 SUMR using V2 method', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.userAddressValue })
      const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

      const balance = await sdk.armada.users.getUserBalance({
        user,
      })
      assert(balance >= oneSumr, 'Balance should be greater than 1 SUMR')

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

    it('should unstake 1 SUMR using V2 method', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.userAddressValue })
      const user = User.createFromEthereum(chainInfo.chainId, userAddress.value)

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
})
