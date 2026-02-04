import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, SharedConfig, TestClientIds, InstiTestConfigs } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createAdminSdkTestSetup(clientId: TestClientIds) {
  const sdk = makeAdminSDK({
    clientId,
    apiDomainUrl: SDKApiUrl,
  })

  const { chainId, rpcUrl, fleetAddressValue, userAddressValue, aqAddressValue } =
    InstiTestConfigs[clientId]

  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })
  const aqAddress = Address.createFromEthereum({
    value: aqAddressValue,
  })

  const userAddress = Address.createFromEthereum({
    value: userAddressValue,
  })
  const governorAddress = Address.createFromEthereum({
    value: userAddressValue,
  })

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.testUserPrivateKey,
    simulateOnly: true,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.testUserPrivateKey,
    simulateOnly: true,
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
