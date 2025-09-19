import { makeAdminSDK, type SDKAdminManager } from '@summerfi/sdk-client'

const apiClientsList: {
  [institutionId: string]: SDKAdminManager
} = {}

export const getInstitutionsSDK: (institutionId: string) => SDKAdminManager = (
  institutionId: string,
) => {
  if (!process.env.SDK_API_URL) {
    throw new Error('SDK_API_URL is not set')
  }
  if (!institutionId) {
    throw new Error('Institution ID is required')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!apiClientsList[institutionId]) {
    apiClientsList[institutionId] = makeAdminSDK({
      clientId: institutionId, // institution ID
      version: 'v1',
      apiDomainUrl: process.env.SDK_API_URL,
    })
  }

  return apiClientsList[institutionId]
}
