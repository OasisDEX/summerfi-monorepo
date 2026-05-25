import { makeSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { SDKApiUrl, TestConfigAccounts, RpcUrls, FleetAddresses } from './testConfig'
import {
  createSendTransactionTool,
  getPublicClientForChain,
  getWalletClientForChain,
} from '@summerfi/testing-utils'

type FleetAddressesByChain = typeof FleetAddresses
type FleetAddressKey<TChainId extends keyof FleetAddressesByChain> =
  keyof FleetAddressesByChain[TChainId]

/**
 * Shared setup for Armada Protocol Access Control tests
 */
export function createSdkTestSetup<TChainId extends keyof FleetAddressesByChain>(params: {
  chainId: TChainId
  simulateOnly?: boolean
}) {
  const { chainId, simulateOnly = true } = params

  const sdk = makeSDK({
    apiDomainUrl: SDKApiUrl,
    logging: process.env.SDK_LOGGING_ENABLED === 'true',
  })

  const userAddress = Address.createFromEthereum({
    value: TestConfigAccounts.testUserAddressValue,
  })

  const signerPrivateKey = TestConfigAccounts.testUserPrivateKey

  const userSendTxTool = createSendTransactionTool({
    chainId: chainId,
    rpcUrl: RpcUrls[chainId],
    senderAddressValue: userAddress.value,
    signerPrivateKey,
    simulateOnly,
  })

  const publicClient = getPublicClientForChain(chainId, RpcUrls[chainId])
  const walletClient = getWalletClientForChain(chainId, RpcUrls[chainId], signerPrivateKey)

  const getFleetAddressValue = <
    TChainId extends keyof typeof FleetAddresses,
    TVault extends FleetAddressKey<TChainId>,
  >(
    chainId: TChainId,
    vault: TVault,
  ) => {
    return FleetAddresses[chainId][vault]
  }

  return {
    sdk,
    chainId,
    userAddress,
    userAddressValue: userAddress.toSolidityValue(),
    userSendTxTool,
    publicClient,
    walletClient,
    getFleetAddressValue,
  }
}

// createSdkTestSetup({ chainId: 1 }).getFleetAddressValue(1, 'ETHDao')
