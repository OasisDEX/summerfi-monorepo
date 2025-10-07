import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, signerPrivateKey, TestConfigs } from './testConfig'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createAccessControlTestSetup() {
  const sdk = makeAdminSDK({
    clientId: 'test-client',
    apiDomainUrl: SDKApiUrl,
  })

  const { chainId, rpcUrl, userAddressValue, fleetAddressValue } = TestConfigs.SelfManaged

  const userAddress = Address.createFromEthereum({ value: userAddressValue })
  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })

  const governorSendTxTool: SendTransactionTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: signerPrivateKey,
  })

  return {
    sdk,
    chainId,
    userAddress,
    fleetAddress,
    governorSendTxTool,
  }
}
