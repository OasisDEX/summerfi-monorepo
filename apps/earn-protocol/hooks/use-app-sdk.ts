import { useSDK as initSdk } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'

export const useAppSDK = () => {
  return initSdk({ apiURL: sdkApiUrl })
}
