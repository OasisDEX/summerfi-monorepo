import { makeAdminSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, TestConfigAccounts, TestClientIds, InstiTestConfigs } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createAdminSdkTestSetup(
  params: {
    clientId?: TestClientIds
    simulateOnly?: boolean
  } = {},
) {
  const { clientId = TestClientIds.ACME, simulateOnly = true } = params

  const sdk = makeAdminSDK({
    clientId,
    apiDomainUrl: SDKApiUrl,
    logging: process.env.SDK_LOGGING_ENABLED === 'true',
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
    senderAddressValue: userAddress.value,
    signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
    simulateOnly,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    senderAddressValue: governorAddress.value,
    signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
    simulateOnly,
  })

  return {
    sdk,
    chainId,
    clientId,
    fleetAddress,
    aqAddress,
    userAddress,
    governorAddress,
    userSendTxTool,
    governorSendTxTool,
  }
}
