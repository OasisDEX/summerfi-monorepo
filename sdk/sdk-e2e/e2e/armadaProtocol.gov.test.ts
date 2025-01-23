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

      describe(`staking`, () => {
        it(`should get balance`, async () => {
          const balance = await sdk.armada.users.getUserBalance({
            user,
          })
          expect(balance).toBeGreaterThan(0n)
          console.log('balance', balance)
        })
        it(`should have a delegate`, async () => {
          const delegate = await sdk.armada.users.getUserDelegatee({
            user,
          })
          console.log('delegatee', delegate)
          assert(delegate.value !== zeroAddress, 'No delegate')
        })

        // staking tx
        it.skip(`should stake all`, async () => {
          const balance = await sdk.armada.users.getUserBalance({
            user,
          })
          console.log('stake all balance', balance)

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
        it.skip(`should unstake`, async () => {
          const unstakeTx = await sdk.armada.users.getUnstakeTx({
            amount: 8000000000000000000n,
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

          // delegate before
          const delegateeBefore = await sdk.armada.users.getUserDelegatee({
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

          const delegateeAfter = await sdk.armada.users.getUserDelegatee({
            user,
          })

          expect(delegateeBefore).not.toEqual(delegateeAfter)
          expect(delegateeAfter.value).toEqual(user.wallet.address.value)
        })
      })

      // desc un-delegation
      describe.skip(`undelegation`, () => {
        it(`should have a delegate`, async () => {
          const delegatee = await sdk.armada.users.getUserDelegatee({
            user,
          })
          expect(delegatee.value).not.toEqual(zeroAddress)
          console.log('delegate', delegatee)
        })
        it(`should have votes`, async () => {
          const votes = await sdk.armada.users.getUserVotes({
            user,
          })
          expect(votes).toBeGreaterThan(0n)
          console.log('votes', votes)
        })

        it(`should undelegate`, async () => {
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
