import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, ChainIds, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import {
  SDKApiUrl,
  testWalletAddress,
  signerPrivateKey,
  FleetAddresses,
  RpcUrls,
} from './utils/testConfig'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol - User', () => {
  const chainId = ChainIds.Sonic
  const rpcUrl = RpcUrls.Sonic

  const user = User.createFromEthereum(chainId, '0x88a135D9aC7583Eb45C1c140fBF6cE474f1f7789')
  const fleetAddress = Address.createFromEthereum({ value: FleetAddresses.Sonic.usdc })

  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })
  if (!rpcUrl) {
    throw new Error('Missing rpc url')
  }

  console.log(`Running on ${chainInfo.name} for user ${user.wallet.address.value}`)

  it(`should get all user positions`, async () => {
    const positions = await sdk.armada.users.getUserPositions({
      user,
    })
    console.log('User positions:')
    positions.forEach((position) => {
      console.log(
        JSON.stringify(
          {
            id: position.id.id,
            amount: position.amount.toString(),
            depositsAmount: position.depositsAmount.toString(),
            withdrawalsAmount: position.withdrawalsAmount.toString(),
            depositsAmountUSD: position.depositsAmountUSD.toString(),
            withdrawalsAmountUSD: position.withdrawalsAmountUSD.toString(),
            deposits: position.deposits.length,
            withdrawals: position.withdrawals.length,
            rewards: position.rewards.map((reward) => ({
              claimed: reward.claimed.toString(),
              claimable: reward.claimable.toString(),
            })),
            claimed: position.claimedSummerToken.toString(),
            claimable: position.claimableSummerToken.toString(),
          },
          null,
          2,
        ),
      )
    })
  })

  it.skip(`should get user position for a specific fleet`, async () => {
    const position = await sdk.armada.users.getUserPosition({
      user: user,
      fleetAddress,
    })
    assert(position != null, 'User position not found')
    console.log(
      `User position for specific fleet`,
      '\n' +
        JSON.stringify(
          {
            id: position.id.id,
            amount: position.amount.toString(),
            depositsAmount: position.depositsAmount.toString(),
            withdrawalsAmount: position.withdrawalsAmount.toString(),
            depositsAmountUSD: position.depositsAmountUSD.toString(),
            withdrawalsAmountUSD: position.withdrawalsAmountUSD.toString(),
            deposits: position.deposits.length,
            withdrawals: position.withdrawals.length,
            rewards: position.rewards.map((reward) => ({
              claimed: reward.claimed.toString(),
              claimable: reward.claimable.toString(),
            })),
            claimed: position.claimedSummerToken.toString(),
            claimable: position.claimableSummerToken.toString(),
          },
          null,
          2,
        ),
    )
  })

  it.skip(`should get user merkl rewards`, async () => {
    const rewards = await sdk.armada.users.getUserMerklRewards({
      address: user.wallet.address.value,
    })
    console.log('User Merkle rewards:', JSON.stringify(rewards, null, 2))
  })

  it.skip(`should get user fleet and staked balance for vault`, async () => {
    const _user = user

    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      user: _user,
      vaultId,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      user: _user,
      vaultId,
    })
    console.log(
      'Fleet balance',
      '\n - Wallet: ',
      fleetAmountBefore.assets.toString(),
      '\n - Staked: ',
      stakedAmountBefore.assets.toString(),
    )
  })

  it.skip(`should unstake all fleet tokens for vault`, async () => {
    // Check initial balances
    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      user,
      vaultId,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      user,
      vaultId,
    })

    console.log('Balances before unstaking:')
    console.log(' - Wallet fleet balance:', fleetAmountBefore.shares.toString())
    console.log(' - Staked fleet balance:', stakedAmountBefore.shares.toString())

    // Assert that there are staked tokens to unstake
    assert(
      stakedAmountBefore.shares.toSolidityValue() > 0n,
      `No staked tokens found. Staked balance: ${stakedAmountBefore.shares.toString()}`,
    )

    console.log(`Unstaking all fleet tokens from vault at ${fleetAddress.value}`)

    // Get unstake transaction (unstake all by not providing amount parameter)
    const transaction = await sdk.armada.users.getUnstakeFleetTokensTx({
      addressValue: user.wallet.address.value,
      vaultId: vaultId,
      // No amount provided - should unstake all
    })

    console.log('Transaction description:', transaction.description)

    // Send transaction
    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions: [transaction],
      rpcUrl: rpcUrl,
      privateKey: signerPrivateKey,
      simulateOnly,
    })

    // Verify transaction success
    statuses.forEach((status) => {
      expect(status).toBe('success')
    })

    if (!simulateOnly) {
      // Check balances after unstaking
      const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
        user,
        vaultId,
      })
      const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
        user,
        vaultId,
      })

      console.log('Balances after unstaking:')
      console.log(' - Wallet fleet balance:', fleetAmountAfter.shares.toString())
      console.log(' - Staked fleet balance:', stakedAmountAfter.shares.toString())

      console.log('Balance changes:')
      console.log(
        ' - Wallet change:',
        fleetAmountAfter.shares.subtract(fleetAmountBefore.shares).toString(),
      )
      console.log(
        ' - Staked change:',
        stakedAmountAfter.shares.subtract(stakedAmountBefore.shares).toString(),
      )

      // Verify that staked balance decreased and wallet balance increased
      assert(
        stakedAmountAfter.shares.toSolidityValue() < stakedAmountBefore.shares.toSolidityValue(),
        'Staked balance should have decreased after unstaking',
      )
      assert(
        fleetAmountAfter.shares.toSolidityValue() > fleetAmountBefore.shares.toSolidityValue(),
        'Wallet balance should have increased after unstaking',
      )

      // Verify that all tokens were unstaked (staked balance should be 0 or very close to 0)
      assert(
        stakedAmountAfter.shares.toSolidityValue() === 0n,
        `All tokens should have been unstaked. Remaining staked balance: ${stakedAmountAfter.shares.toString()}`,
      )
    }
  })
})
