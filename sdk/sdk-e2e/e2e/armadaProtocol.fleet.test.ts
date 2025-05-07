import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'

import { SDKApiUrl, userAddress } from './utils/testConfig'
import assert from 'assert'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol User', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })
  if (!rpcUrl) {
    throw new Error('Missing rpc url')
  }

  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = usdcFleet

  const user = User.createFrom({
    chainInfo,
    wallet: Wallet.createFrom({
      address: userAddress,
    }),
  })
  console.log(`Running on ${chainInfo.name} for user ${userAddress.value}`)

  it(`should get all user positions: ${fleetAddress.value}`, async () => {
    const positions = await sdk.armada.users.getUserPositions({
      user,
    })
    console.log('User positions:')
    positions.forEach((position) => {
      console.log(`Position ${position.id.id} amount: ${position.amount.toString()}`)
    })
  })

  it(`should get user position for a specific fleet: ${fleetAddress.value}`, async () => {
    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress,
    })
    assert(position != null, 'User position not found')
    console.log(`User position for fleet ${fleetAddress.value}: ${position.amount.toString()}`)
  })

  it('should get all fleets', async () => {
    const raw = await sdk.armada.users.getVaultsRaw({
      chainInfo,
    })
    const vaults = raw.vaults
    assert(vaults != null, 'No vaults found')
    console.log('Vaults:')
    vaults.forEach((vault) => {
      console.log(`Vault ${vault.id} amount: ${vault.inputTokenBalance}`)
    })
  })

  it('should get specific fleet', async () => {
    const raw = await sdk.armada.users.getVaultRaw({
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      }),
    })
    const vault = raw.vault
    assert(vault != null, 'Vault not found')
    console.log(`Vault ${vault.id} amount: ${vault.inputTokenBalance}`)
  })
})
