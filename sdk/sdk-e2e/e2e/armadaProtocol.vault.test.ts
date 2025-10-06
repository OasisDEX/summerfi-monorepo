/* eslint-disable @typescript-eslint/no-unused-vars */
import { type SDKManager } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, ChainIds, getChainInfoByChainId, User } from '@summerfi/sdk-common'

import { FleetAddresses, RpcUrls, testWalletAddress } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
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

  const sdk: SDKManager = createTestSDK()

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

  it('should have apys property with all time period values', async () => {
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    assert(vaultInfo != null, 'Vault not found')
    assert(vaultInfo.apys != null, 'apys property should exist')
    assert('live' in vaultInfo.apys, 'apys should have live property')
    assert('sma24h' in vaultInfo.apys, 'apys should have sma24h property')
    assert('sma7day' in vaultInfo.apys, 'apys should have sma7day property')
    assert('sma30day' in vaultInfo.apys, 'apys should have sma30day property')
    console.log('APYs:', {
      live: vaultInfo.apys.live?.toString(),
      sma24h: vaultInfo.apys.sma24h?.toString(),
      sma7day: vaultInfo.apys.sma7day?.toString(),
      sma30day: vaultInfo.apys.sma30day?.toString(),
    })
  })

  it('should verify all vaults have apys property', async () => {
    const vaults = await sdk.armada.users.getVaultInfoList({
      chainId,
    })
    assert(vaults.list.length > 0, 'Should have at least one vault')
    vaults.list.forEach((vault) => {
      assert(vault.apys != null, `Vault ${vault.id.toString()} should have apys property`)
      assert('live' in vault.apys, `Vault ${vault.id.toString()} apys should have live property`)
      assert(
        'sma24h' in vault.apys,
        `Vault ${vault.id.toString()} apys should have sma24h property`,
      )
      assert(
        'sma7day' in vault.apys,
        `Vault ${vault.id.toString()} apys should have sma7day property`,
      )
      assert(
        'sma30day' in vault.apys,
        `Vault ${vault.id.toString()} apys should have sma30day property`,
      )
    })
    console.log('All vaults have valid apys property')
  })
})
