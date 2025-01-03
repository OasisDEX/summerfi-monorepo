import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { formatFiatBalance } from '@summerfi/app-utils'

import classNames from './SumrConversionAndPrice.module.scss'

const getData = (price: string) => [
  {
    title: '$RAYS <> $SUMR Conversion',
    value: '2.2 for 1',
    description: '*Season 1 $RAYS',
  },
  {
    title: 'SUMR Token price',
    value: `$${formatFiatBalance(price)}`,
    description: '*Assumes a 500M Market Cap upon transferability ',
  },
]

interface SumrConversionAndPriceProps {
  sumrPrice: string
}

export const SumrConversionAndPrice: FC<SumrConversionAndPriceProps> = ({ sumrPrice }) => {
  const data = getData(sumrPrice)

  return (
    <div className={classNames.sumrConversionAndPriceWrapper}>
      {data.map((item) => (
        <Card key={item.title} className={classNames.customCard}>
          <Text as="p" variant="p2semi">
            {item.title}
          </Text>
          <Text as="h2" variant="h2colorful">
            {item.value}
          </Text>
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {item.description}
          </Text>
        </Card>
      ))}
    </div>
  )
}
