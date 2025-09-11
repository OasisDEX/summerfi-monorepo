'use client'
import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import classNames from './SumrConversionAndTotalSupply.module.css'

const data = [
  {
    title: 'Maximum supply of $SUMR',
    value: `1,000,000,000`,
  },
]

interface SumrConversionAndTotalSupplyProps {}

export const SumrConversionAndTotalSupply: FC<SumrConversionAndTotalSupplyProps> = () => {
  return (
    <div className={classNames.SumrConversionAndTotalSupplyWrapper}>
      {data.map((item) => (
        <Card key={item.title} className={classNames.customCard}>
          <Text as="p" variant="p2semi">
            {item.title}
          </Text>
          <Text as="h2" variant="h2colorful" style={{ fontWeight: 600 }}>
            {item.value}
          </Text>
        </Card>
      ))}
    </div>
  )
}
