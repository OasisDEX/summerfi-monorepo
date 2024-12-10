import { type FC } from 'react'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './ProjectedEarnings.module.scss'

interface ProjectedEarningsProps {
  earnings: BigNumber | number | string
  symbol: TokenSymbolsList
  after?: string
}

export const ProjectedEarnings: FC<ProjectedEarningsProps> = ({
  earnings,
  symbol,
  after = '1 year',
}) => {
  return (
    <Card className={classNames.wrapper} variant="cardPrimary">
      <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        Estimated earnings after {after}
      </Text>
      <Text as="p" variant="p1semiColorful">
        {`${formatCryptoBalance(earnings)} ${symbol}`}
      </Text>
    </Card>
  )
}
