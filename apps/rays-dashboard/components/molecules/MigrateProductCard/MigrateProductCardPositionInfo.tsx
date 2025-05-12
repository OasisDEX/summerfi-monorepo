import { type PortfolioMigrations, type TokenSymbolsList } from '@summerfi/app-types'
import { Text, TokensGroup, Tooltip } from '@summerfi/app-ui'
import { formatAsShorthandNumbers } from '@summerfi/app-utils'
import { IconHelpCircle } from '@tabler/icons-react'
import BigNumber from 'bignumber.js'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.css'

const getMigrationTokenValue = (
  asset:
    | PortfolioMigrations['migrationsV2'][number]['collateralAsset']
    | PortfolioMigrations['migrationsV2'][number]['debtAsset'],
) =>
  formatAsShorthandNumbers(
    new BigNumber(Number(asset.balance)).shiftedBy(Number(-asset.balanceDecimals)),
    {
      precision: 4,
    },
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
      <Tooltip
        tooltip={
          <Text as="span" variant="p4">
            The total amount of your supplied asset(s), expressed in{' '}
            {migration.collateralAsset.symbol}.
          </Text>
        }
        tooltipWrapperStyles={{ minWidth: '200px' }}
      >
        <Text variant="p4semi" className={migrateProductCardStyles.heading}>
          Balance of Supplied
        </Text>
        <IconHelpCircle
          size={14}
          strokeWidth={2}
          style={{ marginTop: '3px', marginLeft: '5px', stroke: 'var(--color-neutral-80)' }}
        />
      </Tooltip>
      <Text variant="p1semi">{getMigrationTokenValue(migration.collateralAsset)}</Text>
    </div>
    <div>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Borrowed
      </Text>
      <TokensGroup tokens={[tokens[1]]} />
    </div>
    <div>
      <Tooltip
        tooltip={
          <Text as="span" variant="p4">
            The total amount of your borrowed asset(s), expressed in {migration.debtAsset.symbol}.
          </Text>
        }
        tooltipWrapperStyles={{ minWidth: '200px' }}
      >
        <Text variant="p4semi" className={migrateProductCardStyles.heading}>
          Balance of Borrowed
        </Text>
        <IconHelpCircle
          size={14}
          strokeWidth={2}
          style={{ marginTop: '3px', marginLeft: '5px', stroke: 'var(--color-neutral-80)' }}
        />
      </Tooltip>
      <Text variant="p1semi">{getMigrationTokenValue(migration.debtAsset)}</Text>
    </div>
  </div>
)
