'use client'

import { type FC, useState } from 'react'
import { type TransactionAction } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { OrderInformation } from '@/components/molecules/OrderInformation/OrderInformation'
import { type EarningsEstimationsMap } from '@/helpers/get-earnings-estimations-map'

import classNames from './ProjectedEarnings.module.css'

interface ProjectedEarningsExpandedProps {
  forecastSummaryMap: EarningsEstimationsMap
  isLoading?: boolean
  symbol: string
  transactionType: TransactionAction
}

type ForecastMethodType = 'forecast' | 'lowerBound' | 'upperBound'

export const ProjectedEarningsExpanded: FC<ProjectedEarningsExpandedProps> = ({
  forecastSummaryMap,
  isLoading = true,
  symbol,
  transactionType,
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
        Estimated earnings of your position after {transactionType}
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

      <OrderInformation
        wrapperStyles={{
          paddingLeft: 'unset',
          paddingRight: 'unset',
          paddingBottom: 'unset',
        }}
        items={[
          {
            label: 'After 30 days',
            value: `${formatCryptoBalance(forecastSummaryMap['30d'][forecastMethod])} ${symbol}`,
            isLoading,
          },
          {
            label: 'After 6 months',
            value: `${formatCryptoBalance(forecastSummaryMap['6m'][forecastMethod])} ${symbol}`,
            isLoading,
          },
          {
            label: 'After 1 year',
            value: `${formatCryptoBalance(forecastSummaryMap['1y'][forecastMethod])} ${symbol}`,
            isLoading,
          },
          {
            label: 'After 3 years',
            value: `${formatCryptoBalance(forecastSummaryMap['3y'][forecastMethod])} ${symbol}`,
            isLoading,
          },
        ]}
      />
    </Card>
  )
}
