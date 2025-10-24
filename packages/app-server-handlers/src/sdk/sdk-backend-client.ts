import { makeSDK, type SDKManager } from '@summerfi/sdk-client'

if (!process.env.SDK_API_URL) {
  throw new Error('SDK_API_URL is not set')
}

export const backendSDK: SDKManager = makeSDK({
  apiURL: `${process.env.SDK_API_URL}/sdk/trpc`,
  version: 'v2',
})
