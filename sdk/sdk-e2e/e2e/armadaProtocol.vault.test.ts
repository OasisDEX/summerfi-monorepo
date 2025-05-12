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

describe('Armada Protocol Vault', () => {
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
    positions.forEach((position, index) => {
      console.log(`Position ${index} amount: ${position.amount.toString()}`)
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

  it('should get all vaults with info', async () => {
    const vaults = await sdk.armada.users.getVaultInfoList({
      chainId,
    })
    console.log(
      'All vaults info:',
      vaults.list
        .map((vaultInfo) => {
          return JSON.stringify(
            {
              id: vaultInfo.id.toString(),
              token: vaultInfo.token.toString(),
              depositCap: vaultInfo.depositCap.toString(),
              totalDeposits: vaultInfo.totalDeposits.toString(),
              totalShares: vaultInfo.totalShares.toString(),
              apy: vaultInfo.apy?.toString(),
              rewardsApys: vaultInfo.rewardsApys.map((reward) => ({
                token: reward.token.toString(),
                apy: reward.apy?.toString(),
              })),
            },
            null,
            2,
          )
        })
        .toString(),
    )
  })

  it.only('should get a specific vault info', async () => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: ethFleet,
    })
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    assert(vaultInfo != null, 'Vault not found')
    console.log(
      'Specific vault info:',
      JSON.stringify(
        {
          id: vaultInfo.id.toString(),
          token: vaultInfo.token.toString(),
          depositCap: vaultInfo.depositCap.toString(),
          totalDeposits: vaultInfo.totalDeposits.toString(),
          totalShares: vaultInfo.totalShares.toString(),
          apy: vaultInfo.apy?.toString(),
          rewardsApys: vaultInfo.rewardsApys.map((reward) => ({
            token: reward.token.toString(),
            apy: reward.apy?.toString(),
          })),
        },
        null,
        2,
      ),
    )
  })
})
