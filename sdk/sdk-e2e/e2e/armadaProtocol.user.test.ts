import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { SDKApiUrl, testWalletAddress, signerPrivateKey } from './utils/testConfig'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = true

const chainId = ChainIds.Base
const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const selfManagedFleet = Address.createFromEthereum({
  value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
})
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol - User', () => {
  const fleetAddress = ethFleet

  const sdk: SDKManager = makeSDK({
    // apiDomainUrl: SDKApiUrl,
    apiDomainUrl: 'https://summer.fi',
  })
  if (!rpcUrl) {
    throw new Error('Missing rpc url')
  }

  const chainInfo = getChainInfoByChainId(chainId)

  const user = User.createFrom({
    chainInfo,
    wallet: Wallet.createFrom({
      address: testWalletAddress,
    }),
  })
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  console.log(`Running on ${chainInfo.name} for user ${testWalletAddress.value}`)

  it(`should get all user positions: ${fleetAddress.value}`, async () => {
    const positions = await sdk.armada.users.getUserPositions({
      user,
    })
    console.log('User positions:')
    positions.forEach((position) => {
      console.log(`Position ${position.id.id}\n - amount: ${position.amount.toString()}`)
    })
  })

  it.skip(`should get user position for a specific fleet: ${fleetAddress.value}`, async () => {
    const _user = User.createFromEthereum(
      ChainIds.Base,
      '0x4eb7f19d6efcace59eaed70220da5002709f9b71',
    )
    const position = await sdk.armada.users.getUserPosition({
      user: _user,
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

  it.only(`should get user fleet and staked balance for vault: ${fleetAddress.value}`, async () => {
    // const _user = user
    const _user = User.createFromEthereum(
      ChainIds.ArbitrumOne,
      '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
    )
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo: getChainInfoByChainId(ChainIds.ArbitrumOne),
      fleetAddress: Address.createFromEthereum({
        value: '0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58',
      }),
    })

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

  it.skip(`should unstake all fleet tokens for vault: ${fleetAddress.value}`, async () => {
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
    console.log(' - Wallet fleet balance:', fleetAmountBefore.assets.toString())
    console.log(' - Staked fleet balance:', stakedAmountBefore.assets.toString())

    // Assert that there are staked tokens to unstake
    assert(
      stakedAmountBefore.assets.toSolidityValue() > 0n,
      `No staked tokens found. Staked balance: ${stakedAmountBefore.assets.toString()}`,
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
      rpcUrl: rpcUrl!,
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
      console.log(' - Wallet fleet balance:', fleetAmountAfter.assets.toString())
      console.log(' - Staked fleet balance:', stakedAmountAfter.assets.toString())

      console.log('Balance changes:')
      console.log(
        ' - Wallet change:',
        fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).toString(),
      )
      console.log(
        ' - Staked change:',
        stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
      )

      // Verify that staked balance decreased and wallet balance increased
      assert(
        stakedAmountAfter.assets.toSolidityValue() < stakedAmountBefore.assets.toSolidityValue(),
        'Staked balance should have decreased after unstaking',
      )
      assert(
        fleetAmountAfter.assets.toSolidityValue() > fleetAmountBefore.assets.toSolidityValue(),
        'Wallet balance should have increased after unstaking',
      )

      // Verify that all tokens were unstaked (staked balance should be 0 or very close to 0)
      assert(
        stakedAmountAfter.assets.toSolidityValue() === 0n,
        `All tokens should have been unstaked. Remaining staked balance: ${stakedAmountAfter.assets.toString()}`,
      )
    }
  })
})
