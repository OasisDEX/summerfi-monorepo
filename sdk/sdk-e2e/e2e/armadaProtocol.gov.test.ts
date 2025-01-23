import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { User, Wallet } from '@summerfi/sdk-common'
import { zeroAddress } from 'viem'
import assert from 'assert'

import { SDKApiUrl, signerPrivateKey, testConfig } from './utils/testConfig'
import { sendAndLogTransactions } from '@summerfi/testing-utils'

jest.setTimeout(300000)

describe('Armada Protocol Gov', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

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

      describe.skip(`check staked balance and rewards`, () => {
        it(`should get staked balance`, async () => {
          const staked = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          expect(staked).toBeGreaterThan(0n)
          console.log('staked', staked)
        })
        it(`should get earned rewards`, async () => {
          const earned = await sdk.armada.users.getUserEarnedRewards({
            user,
          })
          expect(earned).toBeGreaterThan(0n)
          console.log('earned', earned)
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

          const stakeTx = await sdk.armada.users.getStakeTx({
            user,
            amount: balance,
          })

          // stake before
          const stakedBefore = await sdk.armada.users.getUserStakedBalance({
            user,
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
          expect(stakedAfter).toBeGreaterThan(stakedBefore)
        })
      })

      // unstaking
      describe.skip(`unstaking`, () => {
        // unstaking tx
        it(`should unstake all`, async () => {
          const stakedBalance = await sdk.armada.users.getUserStakedBalance({
            user,
          })
          assert(stakedBalance > 0n, 'Staked balance should be greater than 0')

          const delegate = await sdk.armada.users.getUserDelegatee({
            user,
          })
          assert(delegate.value !== zeroAddress, 'Should have a delegate')

          const unstakeTx = await sdk.armada.users.getUnstakeTx({
            amount: stakedBalance,
          })

          // unstake before
          const stakedBefore = await sdk.armada.users.getUserStakedBalance({
            user,
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
          expect(stakedAfter).toBeLessThan(stakedBefore)
        })
      })

      describe.skip(`delegation`, () => {
        it(`should delegate`, async () => {
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
          expect(votesAfter).toBeGreaterThan(0n)
        })
      })

      // desc un-delegation
      describe.skip(`undelegation`, () => {
        it(`should undelegate`, async () => {
          const delegate = await sdk.armada.users.getUserDelegatee({
            user,
          })
          assert(delegate.value !== zeroAddress, 'Should have a delegate')

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
