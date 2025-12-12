import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { platformLogoMapByMigrationType } from '@/helpers/platform-logo-map'

/**
 * Maps a migratable position to a portfolio card format.
 *
 * @param migratablePosition - The migratable position to map
 * @returns The mapped portfolio card data
 */
export const mapMigrationToPortfolioCard = (migratablePosition: MigratablePosition) => {
  return {
    id: migratablePosition.id,
    chainId: migratablePosition.chainId,
    token: migratablePosition.underlyingTokenAmount.token.symbol.toUpperCase() as TokenSymbolsList,
    depositAmount: migratablePosition.underlyingTokenAmount.amount,
    platformLogo: platformLogoMapByMigrationType[migratablePosition.migrationType] as PlatformLogo,
    migrationType: migratablePosition.migrationType,
  }
}
