import { type FC } from 'react'
import { Card, DataBlock } from '@summerfi/app-earn-ui'
import {
  formatDecimalAsPercent,
  formatFiatBalance,
  formatWithSeparators,
} from '@summerfi/app-utils'

import styles from './InstitutionPageDataBlocks.module.css'

interface InstitutionPageDataBlocksProps {
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
}

export const InstitutionPageDataBlocks: FC<InstitutionPageDataBlocksProps> = ({
  totalValue,
  numberOfVaults,
  thirtyDayAvgApy,
  allTimePerformance,
}) => {
  const dataBlocks = [
    {
      id: '1',
      title: 'Total value',
      value: `$${formatFiatBalance(totalValue)}`,
      gradient: 'var(--gradient-earn-protocol-light)',
      titleColor: 'var(--earn-protocol-secondary-60)',
    },
    {
      id: '2',
      title: 'Number of vaults',
      value: formatWithSeparators(numberOfVaults),
    },
    {
      id: '3',
      title: '30d avg APY',
      value: formatDecimalAsPercent(thirtyDayAvgApy),
    },
    {
      id: '4',
      title: 'All time performance',
      value: formatDecimalAsPercent(allTimePerformance, { plus: true }),
    },
  ]

  return (
    <div className={styles.institutionPageDataBlocksWrapper}>
      {dataBlocks.map((block) => (
        <Card
          variant="cardSecondary"
          key={block.id}
          style={{ background: block.gradient, minHeight: '116px', flex: 1 }}
        >
          <DataBlock
            title={block.title}
            value={block.value}
            valueSize="large"
            titleSize="medium"
            titleStyle={{ color: block.titleColor }}
            wrapperClassName={styles.dataBlockWrapper}
          />
        </Card>
      ))}
    </div>
  )
}
