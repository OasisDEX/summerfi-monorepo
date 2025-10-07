import { type ISDKManager, type ISDKAdminManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  User,
  type IArmadaVaultId,
  type IUser,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, TestConfigs } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol - Unstake', () => {
  const {
    rpcUrl,
    chainId,
    fleetAddressValue: fleetAddress,
    userAddressValue: userAddress,
  } = TestConfigs.Sonic

  const chainInfo = getChainInfoByChainId(chainId)
  const user = User.createFromEthereum(chainId, userAddress)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
  })

  console.log(`Running on ${chainInfo.name} for user ${user.wallet.address.value}`)

  const sdk = createTestSDK()

  it(`should unstake all fleet tokens for vault`, async () => {
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
      rpcUrl,
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
  sdk: ISDKManager | ISDKAdminManager,
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
