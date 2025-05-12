import { type FC, useCallback } from 'react'
import {
  LendingProtocol,
  type NetworkNames,
  type PortfolioMigrations,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { Card, Divider } from '@summerfi/app-ui'

import { MigrateProductCardFooter } from '@/components/molecules/MigrateProductCard/MigrateProductCardFooter'
import { MigrateProductCardPositionInfo } from '@/components/molecules/MigrateProductCard/MigrateProductCardPositionInfo'
import { MigrateProductCardProtocolInfo } from '@/components/molecules/MigrateProductCard/MigrateProductCardProtocolInfo'
import { MigrateProductCardTitle } from '@/components/molecules/MigrateProductCard/MigrationProductCardTitle'
import { networksByChainId } from '@/constants/networks-list'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.css'

interface MigrateProductCardProps {
  migration: PortfolioMigrations['migrationsV2'][number]
}

enum ProtocolId {
  AAVE3 = 'aave3',
  SPARK = 'spark',
}

const LendingProtocolByProtocolId: { [key in ProtocolId]: LendingProtocol } = {
  [ProtocolId.AAVE3]: LendingProtocol.AaveV3,
  [ProtocolId.SPARK]: LendingProtocol.SparkV3,
}

export const MigrateProductCard: FC<MigrateProductCardProps> = ({ migration }) => {
  const protocolConfig = lendingProtocolsByName[migration.protocolId]
  const tokens = [migration.collateralAsset.symbol, migration.debtAsset.symbol].map((token) =>
    token === 'WETH' ? 'ETH' : token,
  ) as TokenSymbolsList[]

  const goToMigration = useCallback(() => {
    let lendingProtocol: LendingProtocol
    let networkName: NetworkNames

    if ('chainId' in migration && 'protocolId' in migration) {
      networkName = networksByChainId[migration.chainId].name
      lendingProtocol = LendingProtocolByProtocolId[migration.protocolId as ProtocolId]
    } else {
      throw new Error('Invalid arguments')
    }

    switch (lendingProtocol) {
      case LendingProtocol.AaveV3:
        window
          .open(`/${networkName}/aave/v3/migrate/${migration.positionAddress}`, '_blank')
          ?.focus()

        break

      case LendingProtocol.SparkV3:
        window
          .open(`/${networkName}/spark/v3/migrate/${migration.positionAddress}`, '_blank')
          ?.focus()

        break

      default:
        throw new Error('Invalid protocol')
    }
  }, [migration])

  return (
    <Card className={migrateProductCardStyles.cardWrapper}>
      <div className={migrateProductCardStyles.content}>
        <MigrateProductCardTitle migration={migration} protocolConfig={protocolConfig} />
        <MigrateProductCardProtocolInfo protocolConfig={protocolConfig} tokens={tokens} />
        <MigrateProductCardPositionInfo migration={migration} tokens={tokens} />
        <Divider
          style={{
            marginTop: 'var(--space-m)',
            marginBottom: 'var(--space-m)',
          }}
        />
        <MigrateProductCardFooter action={goToMigration} />
      </div>
    </Card>
  )
}
