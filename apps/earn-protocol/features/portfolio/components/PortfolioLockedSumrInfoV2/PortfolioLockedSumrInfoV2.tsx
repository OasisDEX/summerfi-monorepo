import {
  Button,
  Card,
  DataModule,
  Icon,
  TabBar,
  Table,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { yourLockedSumrPositionsTableColumns } from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/constants'
import { type LockedSumrPositionsTableColumns } from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/types'

import portfolioLockedSumrInfoV2Styles from './PortfolioLockedSumrInfoV2.module.css'

const TableCenterCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
}

const TableRightCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
}

const LockedSumrPositionsCards = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        dataBlock={{
          title: 'Total SUMR Staking positions',
          value: '4',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: 'Next Unlock date: Sep. 22, 2027 (320,007.88 SUMR)',
          subValueStyle: { color: 'var(--earn-protocol-secondary-40)' },
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Blended APY boost multiple',
          value: '1.4x',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--earn-protocol-secondary-40)',
              }}
            >
              <Icon iconName="question_o" size={16} />
              Max boost: 7x
            </div>
          ),
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Share of all staked SUMR',
          value: '0.79%',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: (
            <WithArrow>
              <Link href="#">Buy SUMR</Link>
            </WithArrow>
          ),
        }}
        cardVariant="cardPrimary"
      />
    </div>
  )
}

const LockedSumrPositionsTable = () => {
  return (
    <Table<LockedSumrPositionsTableColumns>
      columns={yourLockedSumrPositionsTableColumns}
      rows={[
        {
          id: 'position-1',
          content: {
            position: '#1 - 2025-09-09 ',
            staked: <TableRightCell>58,558.03</TableRightCell>,
            lockPeriod: <TableCenterCell>0</TableCenterCell>,
            rewards: <TableCenterCell>0</TableCenterCell>,
            usdEarnings: <TableCenterCell>0</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  n/a
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <Button
                  variant="primarySmall"
                  style={{
                    height: '28px',
                    fontSize: '11px',
                  }}
                >
                  Stake SUMR
                </Button>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-2',
          content: {
            position: '#2 - 2025-09-09 ',
            staked: <TableRightCell>117,116.06</TableRightCell>,
            lockPeriod: <TableCenterCell>2 years</TableCenterCell>,
            rewards: <TableCenterCell>35,343 SUMR (2x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$5,343 (2x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -32,323 (83.3%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-3',
          content: {
            position: '#3 - 2025-09-09 ',
            staked: <TableRightCell>58,558.03</TableRightCell>,
            lockPeriod: <TableCenterCell>4 years</TableCenterCell>,
            rewards: <TableCenterCell>75,343 SUMR (4x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$3,343 (4x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -45,212 (93.6%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-4',
          content: {
            position: '#4 - 2027-09-22 ',
            staked: <TableRightCell>320,007.88</TableRightCell>,
            lockPeriod: <TableCenterCell>1 years</TableCenterCell>,
            rewards: <TableCenterCell>25,343 SUMR (1.5x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$6,343 (1.5x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -145,223 (54.6%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
      ]}
    />
  )
}

const LockedSumrPositions = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.lockedSumrPositionsWrapper}>
      <LockedSumrPositionsCards />
      <LockedSumrPositionsTable />
    </div>
  )
}

export const PortfolioLockedSumrInfoV2 = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <Card variant="cardSecondary">
        <TabBar
          tabs={[
            {
              id: 'your-locked-sumr-positions',
              label: 'Your Locked SUMR Positions',
              content: <LockedSumrPositions />,
            },
            {
              id: 'all-locked-sumr-positions',
              label: 'All Locked SUMR Positions',
              content: <>All Locked SUMR Positions content</>,
            },
          ]}
        />
      </Card>
    </div>
  )
}
