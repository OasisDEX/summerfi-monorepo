import { type EarnAppConfigType } from '@summerfi/app-types'
import { useRouter } from 'next/navigation'

export const useFeatureFlagRedirect = ({
  config,
  featureName,
  customRedirect,
}: {
  config?: EarnAppConfigType
  featureName: keyof EarnAppConfigType['features']
  customRedirect?: string
}) => {
  const router = useRouter()

  if (!config) {
    return
  }

  const { features } = config

  if (!features[featureName]) {
    router.replace(customRedirect ?? '/')
  }
}
