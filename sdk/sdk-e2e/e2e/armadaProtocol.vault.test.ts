/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type IArmadaVaultInfo,
} from '@summerfi/sdk-common'

import { ChainConfigs, SharedConfig } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import assert from 'assert'
import { stringifyArmadaVaultInfo } from './utils/stringifiers'
import { createSdkTestSetup } from './utils/createSdkTestSetup'

jest.setTimeout(300000)

describe('Armada Protocol - Vault', () => {
  const { chainId, fleetAddress, userAddress } = createSdkTestSetup()

  const chainInfo = getChainInfoByChainId(chainId)
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress: Address.createFromEthereum({ value: fleetAddress.value }),
  })

  console.log(`Running on ${chainInfo.name} for user ${userAddress.value}`)

  const sdk = createTestSDK()

  it('should get all vaults with info', async () => {
    const vaults = await sdk.armada.users.getVaultInfoList({
      chainId,
    })
    assert(vaults.list.length > 0, 'No vaults found')
    console.log('All vaults info:\n', vaults.list.map(stringifyArmadaVaultInfo).join('\n'))

    vaults.list.forEach(validateApys)
  })
  it('should get a specific vault info', async () => {
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    assert(vaultInfo != null, 'Vault not found')
    console.log('Specific vault info:\n', stringifyArmadaVaultInfo(vaultInfo))

    validateApys(vaultInfo)
  })
})

const validateApys = (vault: IArmadaVaultInfo) => {
  assert(vault.apys != null, `Vault ${vault.id.toString()} should have apys property`)
  assert('live' in vault.apys, `Vault ${vault.id.toString()} apys should have live property`)
  assert('sma24h' in vault.apys, `Vault ${vault.id.toString()} apys should have sma24h property`)
  assert('sma7day' in vault.apys, `Vault ${vault.id.toString()} apys should have sma7day property`)
  assert(
    'sma30day' in vault.apys,
    `Vault ${vault.id.toString()} apys should have sma30day property`,
  )
}
