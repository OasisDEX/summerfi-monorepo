import { User, Wallet, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import { zeroAddress } from 'viem'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, TestConfigs, type TestConfigKey } from './utils/testConfig'

jest.setTimeout(300000)

const simulateOnly = true
const privateKey = SharedConfig.testUserPrivateKey

describe.skip('Armada Protocol Gov', () => {
  const sdk = createTestSDK()

  const scenarios: { testConfigKey: TestConfigKey }[] = [
    {
      testConfigKey: 'BaseUSDC',
    },
  ]

  describe.each(scenarios)('with scenario %#', (scenario) => {
    const { testConfigKey: chainConfigKey } = scenario

    it('should check SUMR balance', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      if (!rpcUrl) {
        throw new Error('Missing fork url')
      }

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const balance = await sdk.armada.users.getUserBalance({
        user,
      })
      expect(balance).toBeDefined()
      console.log('balance', balance)
    })

    it('should check SUMR staked balance', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const stakedBalance = await sdk.armada.users.getUserStakedBalance({
        user,
      })
      expect(stakedBalance).toBeDefined()
      console.log('staked', stakedBalance)
    })

    it('should check SUMR delegate', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const delegate = await sdk.armada.users.getUserDelegatee({
        user,
      })
      expect(delegate).toBeDefined()
      console.log('delegate', delegate)
    })

    it('should check SUMR votes', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const votes = await sdk.armada.users.getUserVotes({
        user,
      })
      expect(votes).toBeDefined()
      console.log('votes', votes)
    })

    it('should check SUMR earned rewards', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const earned = await sdk.armada.users.getUserEarnedRewards({
        user,
      })
      expect(earned).toBeDefined()
      console.log('earned', earned)
    })

    it.skip('should delegate', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const votes = await sdk.armada.users.getUserVotes({
        user,
      })
      assert(votes === 0n, 'Votes should be 0')

      const delegateTx = await sdk.armada.users.getDelegateTx({
        user,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: delegateTx,
        rpcUrl: rpcUrl,
        privateKey,
        simulateOnly,
      })
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })

      const delegateAfter = await sdk.armada.users.getUserDelegatee({
        user,
      })
      const votesAfter = await sdk.armada.users.getUserVotes({
        user,
      })

      expect(delegateAfter.value).toEqual(user.wallet.address.value)
      expect(votesAfter).toBeGreaterThan(votes)
    })

    it.skip('should stake all', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const balance = await sdk.armada.users.getUserBalance({
        user,
      })
      assert(balance > 0n, 'Balance should be greater than 0')

      const delegate = await sdk.armada.users.getUserDelegatee({
        user,
      })
      assert(delegate.value !== zeroAddress, 'Should have a delegate')

      const staked = await sdk.armada.users.getUserStakedBalance({
        user,
      })

      const stakeTx = await sdk.armada.users.getStakeTx({
        user,
        amount: balance,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: stakeTx,
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
      expect(stakedAfter).toBeGreaterThan(staked)
    })

    it.skip('should unstake all', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const staked = await sdk.armada.users.getUserStakedBalance({
        user,
      })
      assert(staked > 0n, 'Staked balance should be greater than 0')

      const delegate = await sdk.armada.users.getUserDelegatee({
        user,
      })
      assert(delegate.value !== zeroAddress, 'Should have a delegate')

      const votes = await sdk.armada.users.getUserVotes({
        user,
      })

      const unstakeTx = await sdk.armada.users.getUnstakeTx({
        amount: staked,
      })

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: unstakeTx,
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
      const votesAfter = await sdk.armada.users.getUserVotes({
        user,
      })

      expect(stakedAfter).toBeLessThan(staked)
      expect(votesAfter).toBeLessThan(votes)
    })

    it.skip('should undelegate', async () => {
      const chainConfig = TestConfigs[chainConfigKey]
      const chainInfo = getChainInfoByChainId(chainConfig.chainId)
      const rpcUrl = chainConfig.rpcUrl
      const userAddress = Address.createFromEthereum({ value: SharedConfig.testUserAddressValue })

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      const delegate = await sdk.armada.users.getUserDelegatee({
        user,
      })
      assert(delegate.value !== zeroAddress, 'Should have a delegate')

      const staked = await sdk.armada.users.getUserStakedBalance({
        user,
      })
      assert(staked === 0n, 'should not have staked balance')

      const undelegateTx = await sdk.armada.users.getUndelegateTx()

      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions: undelegateTx,
        rpcUrl: rpcUrl,
        privateKey,
        simulateOnly,
      })
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })

      const delegateeAfter = await sdk.armada.users.getUserDelegatee({
        user,
      })

      expect(delegateeAfter.value).toEqual(zeroAddress)
    })
  })
})
