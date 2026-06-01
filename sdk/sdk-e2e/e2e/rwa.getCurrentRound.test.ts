import {
  Address,
  ArmadaVaultId,
  RoundsVaultType,
  getChainInfoByChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
import assert from 'assert'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getCurrentRound (read; current open round number for a Fleet's Input or Output RoundsVault).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below to point at a real
 * Fleet + vault side.
 */
describe('RWA - getCurrentRound', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    vaultType: RoundsVaultType
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      vaultType: RoundsVaultType.Input,
    },
  ]

  test.each(scenarios)(
    'reads current round for fleet $fleetAddressValue ($vaultType)',
    async ({ fleetAddressValue, vaultType }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })

      const currentRound = await sdk.rwa.getCurrentRound({ vaultId, vaultType })
      console.log(`[RWA getCurrentRound] ${vaultType} ${fleetAddressValue}: ${currentRound}`)
      assert(typeof currentRound === 'bigint', 'getCurrentRound should return a bigint')
    },
  )
})
