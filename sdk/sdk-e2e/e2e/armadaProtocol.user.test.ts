import { type ISDKManager, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  User,
  type IArmadaVaultId,
  type ITokenAmount,
  type IUser,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { testWalletAddress, signerPrivateKey, FleetAddresses, RpcUrls } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'
import { stringifyArmadaPosition } from './utils/stringifiers'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol - User', () => {
  const chainId = ChainIds.Sonic
  const rpcUrl = RpcUrls.Sonic
  const fleetAddressValue = FleetAddresses.Sonic.usdc

  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = Address.createFromEthereum({ value: fleetAddressValue })
  const user = User.createFromEthereum(chainId, testWalletAddress.value)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  console.log(`Running on ${chainInfo.name} for user ${user.wallet.address.value}`)

  const sdk: SDKManager = createTestSDK()

  it(`should get all user positions`, async () => {
    const positions = await sdk.armada.users.getUserPositions({
      user,
    })
    console.log('All user positions:\n', positions.map(stringifyArmadaPosition).join('\n'))
  })

  it(`should get user position for a specific fleet`, async () => {
    const position = await sdk.armada.users.getUserPosition({
      user: user,
      fleetAddress,
    })
    assert(position != null, 'User position not found')
    console.log(`Specific user position:\n`, stringifyArmadaPosition(position))
  })

  it.skip(`should get user merkl rewards`, async () => {
    const rewards = await sdk.armada.users.getUserMerklRewards({
      address: user.wallet.address.value,
    })
    console.log('User Merkle rewards:', JSON.stringify(rewards, null, 2))
  })

  it.skip(`should unstake all fleet tokens for vault`, async () => {
    const balancesBefore = await logBalances('Before unstaking', sdk, user, vaultId)
    // Assert that there are staked tokens to unstake

    assert(
      balancesBefore.stakedAmount.shares.toSolidityValue() > 0n,
      `No staked tokens found to unstake`,
    )

    console.log(`Unstaking all staked tokens`)

    // Get unstake transaction (unstake all by not providing amount parameter)
    const transaction = await sdk.armada.users.getUnstakeFleetTokensTx({
      addressValue: user.wallet.address.value,
      vaultId: vaultId,
      // No amount provided - should unstake all
    })

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
      await logBalances('After unstaking', sdk, user, vaultId)
    }
  })
})

async function logBalances(
  message: string,
  sdk: ISDKManager,
  user: IUser,
  vaultId: IArmadaVaultId,
) {
  const fleetAmount = await sdk.armada.users.getFleetBalance({
    user,
    vaultId,
  })
  const stakedAmount = await sdk.armada.users.getStakedBalance({
    user,
    vaultId,
  })
  console.log(
    message,
    '\n - Wallet: ',
    fleetAmount.assets.toString(),
    '\n - Staked: ',
    stakedAmount.assets.toString(),
  )

  return { fleetAmount, stakedAmount }
}

async function logDifference(
  balancesBefore: {
    fleetAmount: {
      shares: ITokenAmount
      assets: ITokenAmount
    }
    stakedAmount: {
      shares: ITokenAmount
      assets: ITokenAmount
    }
  },
  balancesAfter: {
    fleetAmount: { shares: ITokenAmount; assets: ITokenAmount }
    stakedAmount: { shares: ITokenAmount; assets: ITokenAmount }
  },
) {
  console.log(
    'Difference',
    '\n - Wallet: ',
    balancesAfter.fleetAmount.assets.toSolidityValue() -
      balancesBefore.fleetAmount.assets.toSolidityValue(),
    '\n - Staked: ',
    balancesAfter.stakedAmount.assets.toSolidityValue() -
      balancesBefore.stakedAmount.assets.toSolidityValue(),
  )
}
