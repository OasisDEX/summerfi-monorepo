'use client'

import { type FC, useMemo, useState } from 'react'
import {
  Button,
  Card,
  getScannerUrl,
  Icon,
  Table,
  type TableRow,
  Text,
} from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import Link from 'next/link'

import {
  type RwaActivityItem,
  type RwaVaultActivity,
} from '@/app/server-handlers/institution/institution-vaults'
import { activityColumns } from '@/features/panels/vaults/components/PanelActivity/columns'
import { formatActivityLogTypeToHuman } from '@/features/panels/vaults/components/PanelActivity/mapper'
import { type ActivityTableColumns } from '@/features/panels/vaults/components/PanelActivity/types'

import styles from '@/features/panels/vaults/components/PanelActivity/PanelActivity.module.css'

// Human labels per rounds-vault side + receipt activity type. Input vault = deposit flow, Output =
// withdrawal flow; the same on-chain types mean different things on each side.
const rwaActivityLabels: { [side in RwaActivityItem['side']]: { [type: string]: string } } = {
  deposit: {
    DEPOSIT: 'Deposit',
    REDEEM_CURRENT: 'Deposit cancelled',
    REDEEM_EXCHANGE: 'Shares claimed',
  },
  withdrawal: {
    DEPOSIT: 'Withdrawal requested',
    REDEEM_CURRENT: 'Withdrawal cancelled',
    REDEEM_EXCHANGE: 'Assets claimed',
  },
}

const labelForActivity = (item: RwaActivityItem): string =>
  rwaActivityLabels[item.side][item.type] ?? formatActivityLogTypeToHuman(item.type)

type SideFilter = 'all' | 'deposit' | 'withdrawal'

const filters: { label: string; value: SideFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Withdrawals', value: 'withdrawal' },
]

export const PanelRwaActivity: FC<{ activity: RwaVaultActivity }> = ({ activity }) => {
  const [sideFilter, setSideFilter] = useState<SideFilter>('all')

  const rows = useMemo<TableRow<ActivityTableColumns>[]>(() => {
    const filtered =
      sideFilter === 'all'
        ? activity.activities
        : activity.activities.filter((item) => item.side === sideFilter)

    return filtered.map((item, index) => ({
      id: `${item.txHash}-${item.account}-${index}`,
      content: {
        when: <Text variant="p3">{dayjs.unix(item.timestamp).format('MMM D, YYYY HH:mm')}</Text>,
        type: <Text variant="p3">{labelForActivity(item)}</Text>,
        // Two stacked lines so the row fits without forcing a horizontal scrollbar: the account +
        // amount on top, the round/state + tx link below.
        activity: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Text variant="p3">
              <Text as="span" variant="p4">
                Round #{item.roundId} ({item.roundState})
              </Text>
              &nbsp;·&nbsp;{formatCryptoBalance(item.amount)} {item.tokenSymbol}
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--color-text-secondary)',
              }}
            >
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {item.account ? formatAddress(item.account) : 'n/a'}
              </Text>
              <Text as="span" variant="p4">
                ·
              </Text>
              <Link
                href={getScannerUrl(activity.chainId, item.txHash)}
                target="_blank"
                rel="noreferrer"
                className={styles.txLink}
              >
                view&nbsp;tx&nbsp;
                <Icon iconName="arrow_increase" size={14} style={{ display: 'inline-block' }} />
              </Link>
            </div>
          </div>
        ),
      },
    }))
  }, [activity, sideFilter])

  return (
    <Card variant="cardSecondary" className={styles.panelActivityWrapper}>
      <Text as="h5" variant="h5">
        Activity
      </Text>
      <div className={styles.headingWrapper}>
        <div className={styles.filters}>
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="primarySmall"
              onClick={() => setSideFilter(filter.value)}
              className={sideFilter === filter.value ? styles.active : styles.button}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      <Card className={styles.tableCard}>
        <Table<ActivityTableColumns>
          rows={rows}
          columns={activityColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
          noRowsContent={
            <Text as="p" variant="p2">
              No deposit or withdrawal activity yet.
            </Text>
          }
        />
      </Card>
    </Card>
  )
}
