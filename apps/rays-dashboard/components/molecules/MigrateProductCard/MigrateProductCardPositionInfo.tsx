import { type PortfolioMigrations, type TokenSymbolsList } from '@summerfi/app-types'
import { Text, TokensGroup } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'

import { formatAsShorthandNumbers } from '@/helpers/formatters'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.scss'

const getMigrationTokenValue = (
  asset:
    | PortfolioMigrations['migrationsV2'][number]['collateralAsset']
    | PortfolioMigrations['migrationsV2'][number]['debtAsset'],
) =>
  formatAsShorthandNumbers(
    new BigNumber(Number(asset.balance)).shiftedBy(Number(-asset.balanceDecimals)),
    4,
  )

export const MigrateProductCardPositionInfo = ({
  tokens,
  migration,
}: {
  tokens: TokenSymbolsList[]
  migration: PortfolioMigrations['migrationsV2'][number]
}) => (
  <div className={migrateProductCardStyles.positionInfo}>
    <div>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Supplied
      </Text>
      <TokensGroup tokens={[tokens[0]]} />
    </div>
    <div>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Balance of Supplied
      </Text>
      <Text variant="p1semi">{getMigrationTokenValue(migration.collateralAsset)}</Text>
    </div>
    <div>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Borrowed
      </Text>
      <TokensGroup tokens={[tokens[1]]} />
    </div>
    <div>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Balance of Borrowed
      </Text>
      <Text variant="p1semi">{getMigrationTokenValue(migration.debtAsset)}</Text>
    </div>
  </div>
)
