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
 * RWA — getExchangeRate (read; settled-round exchange rate snapshot as an IPrice for a RoundsVault).
 *
 * Manual, scenario-parametrized test (not run in CI). Point roundId at a SETTLED round for a meaningful
 * rate.
 */
describe('RWA - getExchangeRate', () => {
  const { sdk, chainId } = createInstiSdkTestSetup()
  const chainInfo = getChainInfoByChainId(chainId)

  const scenarios: {
    fleetAddressValue: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }[] = [
    {
      fleetAddressValue: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      roundId: 0n,
      vaultType: RoundsVaultType.Input,
    },
  ]

  test.each(scenarios)(
    'reads exchange rate for fleet $fleetAddressValue round $roundId ($vaultType)',
    async ({ fleetAddressValue, roundId, vaultType }) => {
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
      })

      const price = await sdk.rwa.getExchangeRate({ vaultId, roundId, vaultType })
      console.log(
        `[RWA getExchangeRate] ${vaultType} ${fleetAddressValue} round ${roundId}: ${price.toString()}`,
      )
      assert(price != null, 'getExchangeRate should return an IPrice')
      assert('value' in price, 'getExchangeRate result should be a Price with a value')
    },
  )
})
