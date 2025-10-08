import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { SDKApiUrl } from './utils/testConfig'

describe('Armada Protocol - Admin E2E Tests', () => {
  const sdk = makeAdminSDK({
    clientId: 'test-client',
    apiDomainUrl: SDKApiUrl,
  })

  const chainId = ChainIds.Base
  const chainInfo = getChainInfoByChainId(chainId)
  const permissionedFleetAddressUsdc = Address.createFromEthereum({
    value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198', // Using a known fleet address
  })

  beforeAll(async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY

    if (!signerPrivateKey || !rpcUrl) {
      throw new Error(
        'Environment variables E2E_USER_PRIVATE_KEY and E2E_SDK_FORK_URL_BASE must be set',
      )
    }
  })

  it('should fetch the list of available arks', async () => {
    const arks = await sdk.armada.admin.arks({
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: permissionedFleetAddressUsdc,
      }),
    })

    expect(Array.isArray(arks)).toBe(true)
    expect(arks.length).toBeGreaterThan(0)
    arks.forEach((ark) => {
      expect(typeof ark).toBe('object')
      expect(ark.value).toMatch(/^0x[a-fA-F0-9]{40}$/)
      console.log('Ark Address:', ark.value)
    })
  })
})
