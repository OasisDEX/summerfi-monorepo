/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { ChainConfigs, SharedConfig } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'
import { stringifyArmadaVaultInfo } from './utils/stringifiers'

jest.setTimeout(300000)

describe('Armada Protocol - Vault', () => {
  const { chainId, fleetAddressValue } = ChainConfigs.SelfManaged
  const userAddressValue = SharedConfig.userAddressValue

  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
  })

  console.log(`Running on ${chainInfo.name} for user ${userAddressValue}`)

  const sdk = createTestSDK()

  it('should get all vaults with info', async () => {
    const vaults = await sdk.armada.users.getVaultInfoList({
      chainId,
    })
    console.log('All vaults info:\n', vaults.list.map(stringifyArmadaVaultInfo).join('\n'))

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

  it('should get a specific vault info', async () => {
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    assert(vaultInfo != null, 'Vault not found')
    console.log('Specific vault info:\n', stringifyArmadaVaultInfo(vaultInfo))

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
})
