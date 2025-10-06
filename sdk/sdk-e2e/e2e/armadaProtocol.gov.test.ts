import { type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'
import { zeroAddress } from 'viem'
import assert from 'assert'

import { signerPrivateKey, testConfig } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { sendAndLogTransactions } from '@summerfi/testing-utils'

jest.setTimeout(300000)

describe.skip('Armada Protocol Gov', () => {
  const sdk: SDKManager = createTestSDK()

  for (const { chainInfo, rpcUrl, userAddress } of testConfig) {
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Running on ${chainInfo.name} for user ${userAddress.value}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })

      describe.skip(`check user not using gov`, () => {
        it(`should have balance`, async () => {
          const balance = await sdk.armada.users.getUserBalance({
            user,
          })
          expect(balance).toBeGreaterThan(0n)
          console.log('balance', balance)
        })
        it(`should not have delegate`, async () => {
          const delegate = await sdk.armada.users.getUserDelegatee({
            user,
          })
          assert(delegate.value === zeroAddress, 'Should not have a delegate')
        })
        it(`should not have staked balance`, async () => {
          const staked = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          expect(staked).toBe(0n)
          console.log('staked', staked)
        })
        it(`should not have votes`, async () => {
          const votes = await sdk.armada.users.getUserVotes({
            user,
          })
          expect(votes).toBe(0n)
          console.log('votes', votes)
        })
        it(`should not have earned rewards`, async () => {
          const earned = await sdk.armada.users.getUserEarnedRewards({
            user,
          })
          expect(earned).toBe(0n)
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
            privateKey: signerPrivateKey,
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
        // staking tx
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
            privateKey: signerPrivateKey,
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

      // unstaking
      describe.skip(`unstaking`, () => {
        // unstaking tx
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
            privateKey: signerPrivateKey,
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

      // desc un-delegation
      describe(`undelegation`, () => {
        it(`should undelegate`, async () => {
          // hasve delegate
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
            privateKey: signerPrivateKey,
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
  }
})
