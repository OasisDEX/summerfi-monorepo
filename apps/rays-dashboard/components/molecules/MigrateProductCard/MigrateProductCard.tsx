import { type FC, useCallback } from 'react'
import {
  LendingProtocol,
  type NetworkNames,
  type PortfolioMigrations,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  AutomationIcon,
  BlockLabel,
  Button,
  Card,
  Divider,
  Icon,
  ProtocolLabel,
  Text,
  TokensGroup,
} from '@summerfi/app-ui'
import { IconArrowRight } from '@tabler/icons-react'
import BigNumber from 'bignumber.js'

import { networksByChainId } from '@/constants/networks-list'
import { formatAsShorthandNumbers } from '@/helpers/formatters'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.scss'

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

const getMigrationTokenValue = (
  asset:
    | MigrateProductCardProps['migration']['collateralAsset']
    | MigrateProductCardProps['migration']['debtAsset'],
) =>
  formatAsShorthandNumbers(
    new BigNumber(Number(asset.balance)).div(
      new BigNumber(10).pow(new BigNumber(Number(asset.balanceDecimals))),
    ),
    4,
  )

export const MigrateProductCard: FC<MigrateProductCardProps> = ({ migration }) => {
  const protocolConfig = lendingProtocolsByName[migration.protocolId]
  const network = networksByChainId[migration.chainId]
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
            <BlockLabel label="1000 rays" variant="colorful" />
            <BlockLabel label="Low Risk" variant="success" />
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
        <div className={migrateProductCardStyles.protocolInfoWrapper}>
          <TokensGroup tokens={tokens} />
          <div className={migrateProductCardStyles.protocolInfo}>
            <Text as="p" variant="p1semi">
              {tokens.join('/')}
            </Text>
            <Text as="p" variant="p3" style={{ color: 'var(--color-neutral-80)' }}>
              {protocolConfig.label}
            </Text>
          </div>
        </div>
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
        <Divider
          style={{
            marginTop: 'var(--space-m)',
            marginBottom: 'var(--space-m)',
          }}
        />
        <div className={migrateProductCardStyles.footer}>
          <div className={migrateProductCardStyles.footerAutomations}>
            <Text variant="p4semi" className={migrateProductCardStyles.heading}>
              Available Upon Migration
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 'var(--space-xs)',
                marginTop: 'var(--space-xs)',
              }}
            >
              <AutomationIcon type="stopLoss" tooltip="Stop Loss" variant="s" />
              <AutomationIcon type="autoBuy" tooltip="Auto Buy" variant="s" />
              <AutomationIcon type="autoSell" tooltip="Auto Sell" variant="s" />
              <AutomationIcon type="partialTakeProfit" tooltip="Partial Take Profit" variant="s" />
            </div>
          </div>
          {/*
           * Migration link should have following format:
           * [networkOrProduct]/aave/[version]/migrate/[address]
           */}
          <Button variant="secondarySmall" onClick={goToMigration}>
            Migrate <IconArrowRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
