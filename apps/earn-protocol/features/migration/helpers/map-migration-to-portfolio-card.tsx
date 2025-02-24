import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { ArmadaMigrationType } from '@summerfi/sdk-common'

import { type MigratablePosition } from '@/app/server-handlers/migration'

export const mapMigrationToPortfolioCard = (migratablePositions: MigratablePosition[]) => {
  const resovledPlatformLogo = {
    [ArmadaMigrationType.AaveV3]: 'aave',
    [ArmadaMigrationType.Compound]: 'morpho',
    [ArmadaMigrationType.Erc4626]: 'spark',
  }

  return migratablePositions.map((position) => ({
    id: position.id,
    platformLogo: resovledPlatformLogo[position.migrationType] as PlatformLogo,
    token: position.underlyingTokenAmount.token.symbol.toUpperCase() as TokenSymbolsList,
    depositAmount: position.underlyingTokenAmount.amount,
    chainId: position.chainId,
    // current30dApy: position.current30dApy,
    // lazySummer30dApy: position.lazySummer30dApy,
    // thirtydApyDifferential: position.thirtydApyDifferential,
    // missingOutAmount: position.missingOutAmount,
  }))
}
