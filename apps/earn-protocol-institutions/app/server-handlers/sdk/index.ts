import { makeAdminSDK, type SDKAdminManager } from '@summerfi/sdk-client'

const apiClientsList: {
  [institutionName: string]: SDKAdminManager
} = {}

export const getInstitutionsSDK: (institutionName: string) => SDKAdminManager = (
  institutionName: string,
) => {
  if (!process.env.EARN_APP_URL) {
    throw new Error('EARN_APP_URL is not set')
  }
  if (!institutionName) {
    throw new Error('Institution ID is required')
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!apiClientsList[institutionName]) {
    apiClientsList[institutionName] = makeAdminSDK({
      clientId: institutionName, // institution ID
      version: 'v2',
      apiDomainUrl: process.env.EARN_APP_URL, // serves as SDK proxy
    })
  }

  return apiClientsList[institutionName]
}
