import { RoundState, RoundsVaultType, type AddressValue } from '@summerfi/sdk-common'
import assert from 'assert'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getRoundState (read; on-chain RoundState enum for a given round of a Fleet's RoundsVault).
 *
 * Manual, scenario-parametrized test (not run in CI). Edit the scenarios below (fleet, roundId, side).
 */
describe('RWA - getRoundState', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddressValue: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 4n,
      vaultType: RoundsVaultType.Input,
    },
  ]

  test.each(scenarios)(
    'reads round state for fleet $fleetAddressValue round $roundId ($vaultType)',
    async ({ fleetAddressValue, roundId, vaultType }) => {
      const state = await sdk.rwa.getRoundState({
        chainId,
        fleetAddress: fleetAddressValue,
        roundId,
        vaultType,
      })
      console.log(
        `[RWA getRoundState] ${vaultType} ${fleetAddressValue} round ${roundId}: ${state}`,
      )
      assert(
        Object.values(RoundState).includes(state),
        `getRoundState should return a RoundState enum value, got ${state}`,
      )
    },
  )
})
