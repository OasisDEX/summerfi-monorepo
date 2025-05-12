import { useMemo } from 'react'
import { type PortfolioMigrations } from '@summerfi/app-types'
import { BlockLabel, ProtocolLabel, Text, Tooltip } from '@summerfi/app-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { getCalculatorValues } from '@summerfi/app-utils/rays'
import BigNumber from 'bignumber.js'

import { networksByChainId } from '@/constants/networks-list'
import { type LendingProtocolConfig } from '@/helpers/lending-protocols-configs'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.css'

const formatRaysPoints = (points: string | number) =>
  formatCryptoBalance(new BigNumber(Number(points).toFixed(0)))

export const MigrateProductCardTitle = ({
  migration,
  protocolConfig,
}: {
  migration: PortfolioMigrations['migrationsV2'][number]
  protocolConfig: LendingProtocolConfig
}) => {
  const { basePoints, migrationBonus, totalPoints } = useMemo(
    () =>
      getCalculatorValues({
        migration: true,
        usdAmount: migration.collateralAsset.usdValue - migration.debtAsset.usdValue,
      }),
    [migration.collateralAsset.usdValue, migration.debtAsset.usdValue],
  )
  const network = networksByChainId[migration.chainId]

  return (
    <div className={migrateProductCardStyles.titleRow}>
      <Text
        as="h4"
        variant="p3semi"
        style={{
          color: 'var(--color-neutral-80)',
        }}
      >
        Migrate
      </Text>
      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
        <Tooltip
          tooltip={
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
              <Text as="span" variant="p4">
                Base amount:{' '}
                <Text as="span" variant="p4semi">
                  {formatRaysPoints(basePoints)}
                </Text>
              </Text>
              <Text as="span" variant="p4">
                Migration bonus:{' '}
                <Text as="span" variant="p4semi">
                  {formatRaysPoints(migrationBonus)}
                </Text>
              </Text>
            </div>
          }
          tooltipWrapperStyles={{ minWidth: '130px' }}
        >
          <BlockLabel label={`${formatRaysPoints(totalPoints)} RAYS`} variant="colorful" />
        </Tooltip>
        <ProtocolLabel
          protocol={{
            label: protocolConfig.label,
            logo: { scale: protocolConfig.logoScale, src: protocolConfig.logo },
          }}
          network={{
            badge: network.badge,
            label: protocolConfig.label,
          }}
        />
      </div>
    </div>
  )
}
