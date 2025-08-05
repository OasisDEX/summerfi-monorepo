import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address, ArmadaVaultId, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { SDKApiUrl } from './utils/testConfig'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'
import { Tenderly, type Vnet } from '@summerfi/tenderly-utils'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Armada Protocol - Admin E2E Tests', () => {
  const sdk = makeAdminSDK({
    clientId: 'test-client',
    apiDomainUrl: SDKApiUrl,
  })

  const chainId = ChainIds.Base
  const chainInfo = getChainInfoByChainId(chainId)
  const permissionedFleetAddress = Address.createFromEthereum({
    value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17', // Using a known fleet address
  })

  let governorSendTxTool: SendTransactionTool

  beforeAll(async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY

    if (!signerPrivateKey || !rpcUrl) {
      throw new Error(
        'Environment variables E2E_USER_PRIVATE_KEY and E2E_SDK_FORK_URL_BASE must be set',
      )
    }

    governorSendTxTool = createSendTransactionTool({
      chainInfo: getChainInfoByChainId(chainId),
      rpcUrl,
      signerPrivateKey,
    })
  })

  it('should fetch the list of available arks', async () => {
    const arks = await sdk.armada.admin.arks({
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: permissionedFleetAddress,
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
