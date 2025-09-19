import { Signer } from '@ethersproject/abstract-signer'

import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManagerWithSigner } from './SDKManagerWithSigner'
import { version as sdkClientVersion } from '../../bundle/package.json'
import type { MakeSDKParams } from './MakeSDK'

export type SDKSigner = Signer

export type MakeSDKWithSignerParams = MakeSDKParams & { signer: SDKSigner }

/*
 * makeSDK is a factory function that creates an instance of SDKManager.
 * It can take either an apiDomainUrl or a direct apiURL, along with an optional logging flag.
 * Best to use apiDomainUrl as it provide automatic versioning and routing depending on the client version.
 */
export function makeSDKWithSigner(params: MakeSDKWithSignerParams) {
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
  const rpcClient = createMainRPCClient({
    apiURL: versionedURL,
    logging: params.logging,
  })

  if (!params.signer) {
    throw new Error('Signer must be provided.')
  }

  return new SDKManagerWithSigner({ rpcClient, signer: params.signer })
}
