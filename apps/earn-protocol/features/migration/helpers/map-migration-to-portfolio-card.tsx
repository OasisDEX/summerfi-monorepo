import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { ArmadaMigrationType } from '@summerfi/sdk-common'

import { type MigratablePosition } from '@/app/server-handlers/migration'

/**
 * Maps a migratable position to a portfolio card format.
 *
 * @param migratablePosition - The migratable position to map
 * @returns The mapped portfolio card data
 */
export const mapMigrationToPortfolioCard = (migratablePosition: MigratablePosition) => {
  const resovledPlatformLogo = {
    [ArmadaMigrationType.AaveV3]: 'aave',
    [ArmadaMigrationType.Compound]: 'morpho',
    [ArmadaMigrationType.Erc4626]: 'spark',
  }

  return {
    id: migratablePosition.id,
    chainId: migratablePosition.chainId,
    token: migratablePosition.underlyingTokenAmount.token.symbol.toUpperCase() as TokenSymbolsList,
    depositAmount: migratablePosition.underlyingTokenAmount.amount,
    platformLogo: resovledPlatformLogo[migratablePosition.migrationType] as PlatformLogo,
    // current30dApy: position.current30dApy,
    // lazySummer30dApy: position.lazySummer30dApy,
    // thirtydApyDifferential: position.thirtydApyDifferential,
    // missingOutAmount: position.missingOutAmount,
  }
}
