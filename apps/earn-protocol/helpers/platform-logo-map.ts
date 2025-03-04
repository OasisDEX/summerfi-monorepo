import { ArmadaMigrationType } from '@summerfi/sdk-common'

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

export const platformLogoMapByMigrationType = {
  [ArmadaMigrationType.AaveV3]: 'aave',
  [ArmadaMigrationType.Compound]: 'morpho',
  [ArmadaMigrationType.Erc4626]: 'spark',
}
