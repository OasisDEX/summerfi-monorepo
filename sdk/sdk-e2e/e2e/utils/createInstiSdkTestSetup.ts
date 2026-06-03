import { makeAdminSDK, makeInstiSdk } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import type { ChainId, InstiVersion } from '@summerfi/sdk-client'
import {
  SDKApiUrl,
  TestConfigAccounts,
  RwaTestConfig,
  TestClientIds,
  InstiTestConfigs,
} from './testConfig'
import { createSendTransactionTool } from '@summerfi/testing-utils'

/**
 * Shared setup for institutional (RWA) SDK tests. Builds an admin-style SDK via `makeInstiSdk`, which
 * forwards the clientId (`Client-Id`) and the institutional deployment-config version (`Insti-Version`,
 * default 'v2'). With v2 the server resolves the institution's deployment config — including the
 * ProtocolAccessManagerV2 used for the per-context whitelist — from the RWA / institutions-v2 subgraph.
 *
 * Whitelist write transactions are sent through `governorSendTxTool` (simulate-only by default) — the
 * signer must hold WHITELIST_MANAGER_ROLE on the institution's access manager for a non-simulated run.
 */
export function createInstiSdkTestSetup(
  params: {
    clientId?: string
    instiVersion?: InstiVersion
    simulateOnly?: boolean
  } = {},
) {
  const { clientId, instiVersion, simulateOnly = true } = params

  let sdk: ReturnType<typeof makeInstiSdk> | ReturnType<typeof makeAdminSDK>
  let chainId: ChainId
  let rpcUrl: string
  let fleetAddress: Address

  if (instiVersion) {
    sdk = makeInstiSdk({
      clientId: clientId ?? RwaTestConfig.clientId,
      instiVersion,
      apiDomainUrl: SDKApiUrl,
      logging: process.env.SDK_LOGGING_ENABLED === 'true',
    })
    chainId = RwaTestConfig.chainId
    rpcUrl = RwaTestConfig.rpcUrl
    fleetAddress = Address.createFromEthereum({
      value: RwaTestConfig.fleetAddressValue,
    })
  } else {
    const _clientId = clientId ?? TestClientIds.ACME
    const config = InstiTestConfigs[_clientId as TestClientIds]
    sdk = makeAdminSDK({
      clientId: _clientId,
      apiDomainUrl: SDKApiUrl,
      logging: process.env.SDK_LOGGING_ENABLED === 'true',
    })
    chainId = config.chainId
    rpcUrl = config.rpcUrl
    fleetAddress = Address.createFromEthereum({
      value: config.fleetAddressValue,
    })
  }

  const userAddress = Address.createFromEthereum({
    value: TestConfigAccounts.testUserAddressValue,
  })
  // The governor / whitelist-manager signer. Defaults to the test user; override the private key in
  // env (TEST_USER_PRIVATE_KEY) with an account holding WHITELIST_MANAGER_ROLE for a real run.
  const governorAddress = userAddress

  const userSendTxTool = createSendTransactionTool({
    chainId,
    rpcUrl,
    senderAddressValue: userAddress.value,
    signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
    simulateOnly,
  })

  const governorSendTxTool = createSendTransactionTool({
    chainId,
    rpcUrl,
    senderAddressValue: governorAddress.value,
    signerPrivateKey: TestConfigAccounts.testUserPrivateKey,
    simulateOnly,
  })

  return {
    sdk,
    chainId,
    clientId,
    instiVersion,
    fleetAddress,
    userAddress,
    governorAddress,
    userSendTxTool,
    governorSendTxTool,
  }
}
