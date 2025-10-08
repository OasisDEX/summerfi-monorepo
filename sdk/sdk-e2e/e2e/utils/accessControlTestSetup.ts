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
  const aqAddress = Address.createFromEthereum({
    value: '0x92176c8Ce4F6c9925ba2dbFAe0E2a395f03512c0',
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
    simulateOnly: false,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl,
    signerPrivateKey: SharedConfig.governorPrivateKey,
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
