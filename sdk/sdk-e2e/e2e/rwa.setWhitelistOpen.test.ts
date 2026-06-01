import { type AddressValue } from '@summerfi/sdk-common'
import { createInstiSdkTestSetup } from './utils/createInstiSdkTestSetup'
import { RwaTestConfig } from './utils/testConfig'

jest.setTimeout(300000)

/**
 * @group e2e
 *
 * RWA whitelist — setWhitelistOpen (toggle the global-open flag for a Fleet context).
 *
 * When open, every account reads as whitelisted for that Fleet. Each scenario sends the toggle tx
 * (simulate-only by default) and re-reads isWhitelistOpen afterwards.
 */
describe('RWA - Whitelist - setWhitelistOpen', () => {
  const { sdk, chainId, governorSendTxTool } = createInstiSdkTestSetup()

  const scenarios: {
    fleetAddress: AddressValue
    isOpen: boolean
  }[] = [
    {
      fleetAddress: (RwaTestConfig.fleetAddressValue || '0x0') as AddressValue,
      isOpen: true,
    },
  ]

  test.each(scenarios)(
    'sets whitelist-open to $isOpen on fleet $fleetAddress',
    async ({ fleetAddress, isOpen }) => {
      const before = await sdk.rwa.isWhitelistOpen({ chainId, fleetAddress })
      console.log(`[RWA whitelist open] before: ${before}`)

      const txInfo = await sdk.rwa.getSetWhitelistOpenTx({ chainId, fleetAddress, isOpen })
      expect(txInfo).toBeDefined()
      console.log(`[RWA whitelist open] tx: ${txInfo.description}`)

      const status = await governorSendTxTool(txInfo)
      expect(status).toBe('success')

      const after = await sdk.rwa.isWhitelistOpen({ chainId, fleetAddress })
      console.log(`[RWA whitelist open] after: ${after}`)
    },
  )
})
