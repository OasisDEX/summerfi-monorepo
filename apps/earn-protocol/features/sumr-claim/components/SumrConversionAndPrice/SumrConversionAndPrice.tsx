'use client'
import { type FC } from 'react'
import {
  Card,
  RAYS_TO_SUMR_CONVERSION_RATE,
  SUMR_CAP,
  Text,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import { formatFiatBalance } from '@summerfi/app-utils'

import classNames from './SumrConversionAndPrice.module.scss'

const getData = (price: string, dilutedValuation: string) => [
  {
    title: '$RAYS <> $SUMR Conversion',
    value: `${RAYS_TO_SUMR_CONVERSION_RATE} for 1`,
    description: '*Season 1 $RAYS',
  },
  {
    title: 'SUMR Token price',
    value: `$${formatFiatBalance(price)}`,
    description: `*Assumes a ${formatFiatBalance(dilutedValuation)} Market Cap upon transferability `,
  },
]

interface SumrConversionAndPriceProps {}

export const SumrConversionAndPrice: FC<SumrConversionAndPriceProps> = () => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const data = getData(estimatedSumrPrice.toString(), sumrNetApyConfig.dilutedValuation)

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
