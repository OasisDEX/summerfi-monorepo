import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address, ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'
import { GeneralRoles, ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { SDKApiUrl, testWalletAddress, privWalletAddress } from './utils/testConfig'
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

  const tenderly = new Tenderly()
  let tenderlyVnet: Vnet
  let rpcUrl: string
  let governorSendTxTool: SendTransactionTool

  beforeAll(async () => {
    tenderlyVnet = await tenderly.createVnet({ chainInfo, atBlock: 33275700 })
    rpcUrl = tenderlyVnet.getRpc()

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
})
