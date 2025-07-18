import { type EarnAppConfigType } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

export const useFeatureFlagRedirect = ({
  config,
  featureName,
  customRedirect,
}: {
  config?: EarnAppConfigType
  featureName: keyof EarnAppConfigType['features']
  customRedirect?: string
}) => {
  if (!config) {
    return
  }

  const { features } = config

  if (!features[featureName]) {
    redirect(customRedirect ?? '/')
  }
}
