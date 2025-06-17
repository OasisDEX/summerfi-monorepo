import { createMainRPCClient } from '../rpc/SDKMainClient'
import { version as sdkClientVersion } from '../../bundle/package.json'
import { Web3Provider, type JsonRpcProvider } from '@ethersproject/providers'
import { SDKManagerWithProvider } from './SDKManagerWithProvider'

export type SDKProvider = Web3Provider | JsonRpcProvider

export type MakeSDKParams = {
  logging?: boolean
  provider: SDKProvider
} & ({ apiDomainUrl: string } | { apiURL: string })

/*
 * makeSDK is a factory function that creates an instance of SDKManager.
 * It can take either an apiDomainUrl or a direct apiURL, along with an optional logging flag.
 * Best to use apiDomainUrl as it provide automatic versioning and routing depending on the client version.
 */
export function makeSDKWithProvider(params: MakeSDKParams) {
  const apiVersion = `v${sdkClientVersion.charAt(0)}`
  let versionedURL: string
  // url based on domain
  if ('apiDomainUrl' in params) {
    versionedURL = new URL(`/sdk/trpc/${apiVersion}`, params.apiDomainUrl).toString()
  }
  // url based on direct url
  else if ('apiURL' in params) {
    const normalizedUrlWithoutVersion = params.apiURL.replace(/\/+$/, '')
    versionedURL = `${normalizedUrlWithoutVersion}/${apiVersion}`
  } else {
    throw new Error('Either apiDomainUrl or apiURL must be provided')
  }

  if (params.logging) {
    console.log('Summer.fi SDK: versionedURL', versionedURL)
  }
  const rpcClient = createMainRPCClient(versionedURL, params.logging)

  if (!params.provider) {
    throw new Error(
      'No web3 provider provided and no window.ethereum found. Please provide a web3 provider.',
    )
  }

  return new SDKManagerWithProvider({ rpcClient, provider: params.provider })
}
