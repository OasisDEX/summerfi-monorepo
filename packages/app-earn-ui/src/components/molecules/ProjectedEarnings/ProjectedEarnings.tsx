import { type FC } from 'react'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { Card } from '@/components/atoms/Card/Card'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './ProjectedEarnings.module.css'

interface ProjectedEarningsProps {
  earnings: BigNumber | number | string | undefined
  symbol: TokenSymbolsList
  isLoading?: boolean
  after?: string
}

export const ProjectedEarnings: FC<ProjectedEarningsProps> = ({
  earnings,
  symbol,
  isLoading,
  after = '1 year',
}) => {
  return (
    <Card className={classNames.wrapper} variant="cardPrimary">
      <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        Estimated earnings after {after}
      </Text>
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
          <SkeletonLine width={90} height={14} />
        </div>
      ) : (
        <Text as="p" variant="p1semiColorful">
          {`${earnings ? formatCryptoBalance(earnings) : '0'} ${symbol}`}
        </Text>
      )}
    </Card>
  )
}
