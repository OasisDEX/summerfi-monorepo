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
  name: string
  asset: string
  nav: number
  aum: number
  fee: number
  inception: number
}

export const DashboardVaultHeader: FC<DashboardVaultHeaderProps> = ({
  name,
  asset,
  nav,
  aum,
  fee,
  inception,
}) => {
  const blocks = [
    {
      title: 'Name',
      value: name,
    },
    {
      title: 'Asset',
      value: asset,
    },
    {
      title: 'NAV',
      value: formatWithSeparators(nav, { precision: 3 }),
    },
    {
      title: 'AUM',
      value: formatCryptoBalance(aum),
    },
    {
      title: 'Fee',
      value: formatDecimalAsPercent(fee),
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
