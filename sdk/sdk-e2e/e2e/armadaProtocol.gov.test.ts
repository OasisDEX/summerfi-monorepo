import { User, Wallet, Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import { zeroAddress } from 'viem'
import assert from 'assert'

import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SharedConfig, ChainConfigs } from './utils/testConfig'
import type { GovTestScenario } from './utils/types'

jest.setTimeout(300000)

const simulateOnly = true
const privateKey = SharedConfig.userPrivateKey

describe.skip('Armada Protocol Gov', () => {
  const sdk = createTestSDK()

  // Configure test scenarios here
  const scenarios: GovTestScenario[] = [
    {
      chainInfo: getChainInfoByChainId(ChainConfigs.BaseUSDC.chainId),
      rpcUrl: ChainConfigs.BaseUSDC.rpcUrl,
      userAddress: Address.createFromEthereum({ value: SharedConfig.userAddressValue }),
      enabled: true,
    },
  ]

  describe.each(scenarios.filter((s) => s.enabled !== false))(
    'Running scenario on $chainInfo.name for user $userAddress.value',
    ({ chainInfo, rpcUrl, userAddress }) => {
      if (!rpcUrl) {
        throw new Error('Missing fork url')
      }

      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe(`check SUMR gov utility functions`, () => {
        it(`check SUMR balance`, async () => {
          const balance = await sdk.armada.users.getUserBalance({
            user,
          })
          expect(balance).toBeDefined()
          console.log('balance', balance)
        })
        it(`check SUMR staked balance`, async () => {
          const stakedBalance = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          expect(stakedBalance).toBeDefined()
          console.log('staked', stakedBalance)
        })
        it(`check SUMR delegate`, async () => {
          const delegate = await sdk.armada.users.getUserDelegatee({
            user,
          })
          expect(delegate).toBeDefined()
          console.log('delegate', delegate)
        })

        it(`check SUMR votes`, async () => {
          const votes = await sdk.armada.users.getUserVotes({
            user,
          })
          expect(votes).toBeDefined()
          console.log('votes', votes)
        })
        it(`check SUMR earned rewards`, async () => {
          const earned = await sdk.armada.users.getUserEarnedRewards({
            user,
          })
          expect(earned).toBeDefined()
          console.log('earned', earned)
        })
      })

      describe.skip(`delegation`, () => {
        it(`should delegate`, async () => {
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
      })

      describe.skip(`staking`, () => {
        it(`should stake all`, async () => {
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
      })

      describe.skip(`unstaking`, () => {
        it(`should unstake all`, async () => {
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
      })

      describe.skip(`undelegation`, () => {
        it(`should undelegate`, async () => {
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
    },
  )
})
