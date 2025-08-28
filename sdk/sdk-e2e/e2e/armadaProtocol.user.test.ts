import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'

import { SDKApiUrl, testWalletAddress } from './utils/testConfig'
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
  const fleetAddress = usdcFleet

  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
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

  it(`should get user position for a specific fleet: ${fleetAddress.value}`, async () => {
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

  it.only(`should get user fleet and staked balance for vault: ${fleetAddress.value}`, async () => {
    // const _user = User.createFromEthereum(
    //   ChainIds.Base,
    //   '0x4eb7f19d6efcace59eaed70220da5002709f9b71',
    // )
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
})
