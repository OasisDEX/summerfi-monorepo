import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, ChainConfigs, SharedConfig } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createAccessControlTestSetup() {
  const sdk = makeAdminSDK({
    clientId: 'test-client',
    apiDomainUrl: SDKApiUrl,
  })

  const { chainId, rpcUrl, fleetAddressValue } = ChainConfigs.SelfManaged

  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })
  const userAddress = Address.createFromEthereum({
    value: SharedConfig.userAddressValue,
  })
  const governorAddress = Address.createFromEthereum({
    value: SharedConfig.governorAddressValue,
  })

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.userPrivateKey,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.governorPrivateKey,
  })

  return {
    sdk,
    chainId,
    fleetAddress,
    userAddress,
    governorAddress,
    userSendTxTool,
    governorSendTxTool,
  }
}
