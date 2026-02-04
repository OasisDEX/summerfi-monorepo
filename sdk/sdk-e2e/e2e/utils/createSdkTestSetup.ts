import { makeSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, TestConfigs, SharedConfig, type TestConfigKey } from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createSdkTestSetup(testConfigKey: TestConfigKey = 'BaseUSDC') {
  const sdk = makeSDK({
    apiDomainUrl: SDKApiUrl,
  })

  const { chainId, rpcUrl, fleetAddressValue } = TestConfigs[testConfigKey]

  const fleetAddress = Address.createFromEthereum({
    value: fleetAddressValue,
  })

  const userAddress = Address.createFromEthereum({
    value: SharedConfig.testUserAddressValue,
  })

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.testUserPrivateKey,
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
