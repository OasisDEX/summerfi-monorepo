import { type FC } from 'react'
import { DataBlock } from '@summerfi/app-earn-ui'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatWithSeparators,
} from '@summerfi/app-utils'
import dayjs from 'dayjs'

import styles from './DashboardVaultHeader.module.css'

interface DashboardVaultHeaderProps {
  vaultName?: string | null
  liveApy?: number
  nav: number | string
  aum: number
  fee: number
  inception: number
}

export const DashboardVaultHeader: FC<DashboardVaultHeaderProps> = ({
  vaultName,
  liveApy,
  nav,
  aum,
  fee,
  inception,
}) => {
  const blocks = [
    {
      title: 'Name',
      value: vaultName ?? 'Unnamed vault',
    },
    {
      title: 'Live APY',
      value: liveApy ? formatDecimalAsPercent(liveApy) : 'n/a',
    },
    {
      title: 'NAV',
      value: nav ? formatWithSeparators(nav, { precision: 3 }) : 'n/a',
    },
    {
      title: 'AUM',
      value: aum ? formatCryptoBalance(aum) : 'n/a',
    },
    {
      title: 'Fee',
      value: fee ? formatDecimalAsPercent(fee) : 'n/a',
    },
    {
      title: 'Inception',
      value: dayjs(inception).format('MMMM D, YYYY'),
    },
  ]

  return (
    <div className={styles.dashboardVaultHeaderWrapper}>
      {blocks.map((block) => (
        <DataBlock
          key={block.title}
          title={block.title}
          value={block.value}
          valueSize="medium"
          wrapperClassName={styles.dataBlockWrapper}
        />
      ))}
    </div>
  )
}
