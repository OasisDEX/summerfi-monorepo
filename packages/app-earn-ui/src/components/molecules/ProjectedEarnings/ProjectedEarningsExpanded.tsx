import { type FC, useState } from 'react'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { type EarningsEstimationsMap } from '@/helpers/get-earnings-estimations-map'

import classNames from './ProjectedEarnings.module.scss'

interface ProjectedEarningsExpandedProps {
  forecastSummaryMap: EarningsEstimationsMap
  isLoading?: boolean
  symbol: string
}

type ForecastMethodType = 'forecast' | 'lowerBound' | 'upperBound'

export const ProjectedEarningsExpanded: FC<ProjectedEarningsExpandedProps> = ({
  forecastSummaryMap,
  isLoading = true,
  symbol,
}) => {
  const [forecastMethod, setForecastMethod] = useState<ForecastMethodType>('forecast')

  return (
    <Card className={classNames.wrapper} variant="cardPrimary">
      <Text
        variant="p3semi"
        style={{
          color: 'var(--color-text-primary-disabled)',
        }}
      >
        Estimated earnings of your position after deposit
      </Text>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 'var(--spacing-space-medium)',
        }}
      >
        {['forecast', 'lowerBound', 'upperBound'].map((method) => (
          <Button
            key={method}
            variant="secondarySmall"
            style={{
              backgroundColor: forecastMethod !== method ? 'transparent' : undefined,
            }}
            onClick={
              forecastMethod === method
                ? undefined
                : () => {
                    setForecastMethod(method as ForecastMethodType)
                  }
            }
          >
            {
              {
                forecast: 'Median',
                lowerBound: 'Lower bound',
                upperBound: 'Upper bound',
              }[method]
            }
          </Button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          marginTop: 'var(--spacing-space-medium)',
          width: '100%',
          placeItems: 'start stretch',
        }}
      >
        <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
          After 30 days
        </Text>
        <Text variant="p3semi" as="div" style={{ textAlign: 'right' }}>
          {isLoading ? (
            <SkeletonLine width={70} height={10} style={{ marginTop: '5px' }} />
          ) : (
            <>
              {formatCryptoBalance(forecastSummaryMap['30d'][forecastMethod])}&nbsp;{symbol}
            </>
          )}
        </Text>
        <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
          6 months
        </Text>
        <Text variant="p3semi" as="div" style={{ textAlign: 'right' }}>
          {isLoading ? (
            <SkeletonLine width={70} height={10} style={{ marginTop: '5px' }} />
          ) : (
            <>
              {formatCryptoBalance(forecastSummaryMap['6m'][forecastMethod])}&nbsp;{symbol}
            </>
          )}
        </Text>
        <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
          1 year
        </Text>
        <Text variant="p3semi" as="div" style={{ textAlign: 'right' }}>
          {isLoading ? (
            <SkeletonLine width={70} height={10} style={{ marginTop: '5px' }} />
          ) : (
            <>
              {formatCryptoBalance(forecastSummaryMap['1y'][forecastMethod])}&nbsp;{symbol}
            </>
          )}
        </Text>
        <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
          3 years
        </Text>
        <Text variant="p3semi" as="div" style={{ textAlign: 'right' }}>
          {isLoading ? (
            <SkeletonLine width={70} height={10} style={{ marginTop: '5px' }} />
          ) : (
            <>
              {formatCryptoBalance(forecastSummaryMap['3y'][forecastMethod])}&nbsp;{symbol}
            </>
          )}
        </Text>
      </div>
    </Card>
  )
}
