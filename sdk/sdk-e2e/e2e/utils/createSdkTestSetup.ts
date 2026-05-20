import { makeSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, TestConfigs, TestConfigAccounts, type TestConfigKey } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createSdkTestSetup(testConfigKey: TestConfigKey = 'BaseUSDC') {
  const sdk = makeSDK({
    apiDomainUrl: SDKApiUrl,
    logging: process.env.SDK_LOGGING_ENABLED === 'true',
  })

  const { chainId, rpcUrl, fleetAddressValue } = TestConfigs[testConfigKey]

  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })

  const userAddress = Address.createFromEthereum({
    value: TestConfigAccounts.testUserAddressValue,
  })

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    senderAddressValue: userAddress.value,
    signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
    simulateOnly: false,
  })

  return {
    sdk,
    chainId,
    fleetAddress,
    userAddress,
    userSendTxTool,
    aqAddress: undefined,
    governorAddress: undefined,
    governorSendTxTool: undefined,
  }
}
