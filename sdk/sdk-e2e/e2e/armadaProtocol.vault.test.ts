/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, ChainIds, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { FleetAddresses, RpcUrls, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import assert from 'assert'
import { stringifyArmadaVaultInfo } from './utils/stringifiers'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol - Vault', () => {
  const chainId = ChainIds.Sonic
  const rpcUrl = RpcUrls.Sonic
  const fleetAddressValue = FleetAddresses.Sonic.usdc

  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = Address.createFromEthereum({ value: fleetAddressValue })

  console.log(`Running on ${chainInfo.name} for user ${testWalletAddress.value}`)

  const sdk: SDKManager = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  it('should get all vaults with info', async () => {
    const vaults = await sdk.armada.users.getVaultInfoList({
      chainId,
    })
    console.log('All vaults info:\n', vaults.list.map(stringifyArmadaVaultInfo).join('\n'))
  })

  it('should get a specific vault info', async () => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    assert(vaultInfo != null, 'Vault not found')
    console.log('Specific vault info:\n', stringifyArmadaVaultInfo(vaultInfo))
  })
})
