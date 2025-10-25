import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, ChainConfigs, SharedConfig, clientId } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createAdminSdkTestSetup() {
  const sdk = makeAdminSDK({
    clientId,
    apiDomainUrl: SDKApiUrl,
  })

  const { chainId, rpcUrl, fleetAddressValue } = ChainConfigs.SelfManaged

  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })
  const aqAddress = Address.createFromEthereum({
    value: '0xaae3f78433a13e3c2aa440600cbd22081b579d15',
  })

  const userAddress = Address.createFromEthereum({
    value: SharedConfig.userAddressValue,
  })
  const governorAddress = Address.createFromEthereum({
    value: SharedConfig.userAddressValue,
  })

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.userPrivateKey,
    simulateOnly: false,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.userPrivateKey,
    simulateOnly: false,
  })

  return {
    sdk,
    chainId,
    fleetAddress,
    aqAddress,
    userAddress,
    governorAddress,
    userSendTxTool,
    governorSendTxTool,
  }
}
