import aaveLogo from '@/public/img/platform_icons/platform_logo_aave.svg'
import morphoLogo from '@/public/img/platform_icons/platform_logo_morpho.svg'
import sparkLogo from '@/public/img/platform_icons/platform_logo_spark.svg'
import summerLogo from '@/public/img/platform_icons/platform_logo_summerfi.svg'

export const platformLogoMap = {
  aave: aaveLogo,
  morpho: morphoLogo,
  spark: sparkLogo,
  summer: summerLogo,
}

export type PlatformLogoMap = keyof typeof platformLogoMap
