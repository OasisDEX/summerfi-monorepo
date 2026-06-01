import { RoundsVaultType, type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA — getSetMinimumPositionSizeTx (build RoundsVaultBase.setMinPositionSize for the Input or Output
 * RoundsVault of a Fleet).
 *
 * Manual, scenario-parametrized test (not run in CI). `minimumPositionSize` is human-readable and is
 * converted to base units via the target vault's underlying-token decimals. Sent via the governor
 * signer (simulate-only by default; the signer must hold the role allowed to set it for a real run).
 */
describe('RWA - getSetMinimumPositionSizeTx', () => {
  const { sdk, chainId, governorSendTxTool } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    /** Human-readable minimum position size (e.g. "100"). */
    minimumPositionSize: string
  }[] = [
    {
      fleetAddress: RwaTestConfig.fleetAddressValue,
      vaultType: RoundsVaultType.Input,
      minimumPositionSize: '1',
    },
  ]

  test.each(scenarios)(
    'builds set-min-position-size tx for fleet $fleetAddress ($vaultType) → $minimumPositionSize',
    async ({ fleetAddress, vaultType, minimumPositionSize }) => {
      const tx = await sdk.rwa.getSetMinimumPositionSizeTx({
        chainId,
        fleetAddress,
        vaultType,
        minimumPositionSize,
      })
      expect(tx).toBeDefined()
      console.log(`[RWA getSetMinimumPositionSizeTx] tx: ${tx.description}`)

      const status = await governorSendTxTool(tx)
      expect(status).toBe('success')
    },
  )
})
