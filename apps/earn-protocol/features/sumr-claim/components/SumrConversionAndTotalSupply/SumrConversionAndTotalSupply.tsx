'use client'
import { type FC } from 'react'
import { Card, RAYS_TO_SUMR_CONVERSION_RATE, Text } from '@summerfi/app-earn-ui'

import classNames from './SumrConversionAndTotalSupply.module.css'

const data = [
  {
    title: '$RAYS <> $SUMR Conversion',
    value: `~${RAYS_TO_SUMR_CONVERSION_RATE} for 1`,
    description: '*Season 1 $RAYS',
  },
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
          {item.description && (
            <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              {item.description}
            </Text>
          )}
        </Card>
      ))}
    </div>
  )
}
