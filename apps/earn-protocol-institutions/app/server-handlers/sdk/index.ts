import { makeAdminSDK, type SDKAdminManager } from '@summerfi/sdk-client'

const apiClientsList: {
  [institutionName: string]: SDKAdminManager
} = {}

export const getInstitutionsSDK: (institutionName: string) => SDKAdminManager = (
  institutionName: string,
) => {
  if (!process.env.SDK_API_URL) {
    throw new Error('SDK_API_URL is not set')
  }
  if (!institutionName) {
    throw new Error('Institution ID is required')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!apiClientsList[institutionName]) {
    apiClientsList[institutionName] = makeAdminSDK({
      clientId: institutionName, // institution ID
      version: 'v1',
      apiDomainUrl: process.env.SDK_API_URL,
    })
  }

  return apiClientsList[institutionName]
}
