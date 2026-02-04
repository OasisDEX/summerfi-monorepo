import { Icon, SimpleGrid, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { type TooltipContentProps } from 'recharts'

import forecastTooltipStyles from '@/components/organisms/Charts/components/ForecastTooltip.module.css'

const SvgCircle = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
)

export const ForecastTooltip = ({
  active,
  payload,
  label,
  tokenPrice,
}: TooltipContentProps<number | [number, number], 'bounds' | 'forecast'> & {
  tokenPrice?: string | null
}) => {
  const parsedPayload = payload.reduce<{ bounds?: [number, number]; forecast?: number }>(
    (acc, { name: valueName, value }) => {
      return {
        ...acc,
        [valueName as string]: Array.isArray(value)
          ? value.map((val) => val * Number(tokenPrice ?? 0))
          : value
            ? value * Number(tokenPrice ?? 0)
            : 0,
      }
    },
    {},
  )

  if (active && parsedPayload.bounds && parsedPayload.forecast) {
    const {
      bounds: [lowerBound, upperBound],
      forecast,
    } = parsedPayload

    return (
      <div className={forecastTooltipStyles.forecastTooltipWrapper}>
        <div
          className={clsx(forecastTooltipStyles.timestampInfo, forecastTooltipStyles.subtleText)}
        >
          <Icon iconName="clock" size={18} />
          <Text variant="p4semi" as="p">
            {dayjs(label).format('MMM DD, YYYY')}
          </Text>
        </div>
        <div className={forecastTooltipStyles.divider} />
        <SimpleGrid columns={3} rows={4}>
          <div
            className={clsx(forecastTooltipStyles.firstColumn, forecastTooltipStyles.subtleText)}
          >
            <Text variant="p4semi">Forecast Range</Text>
          </div>
          <div className={clsx(forecastTooltipStyles.gridColumn, forecastTooltipStyles.subtleText)}>
            <Text variant="p4semi">Earning</Text>
          </div>
          <div className={clsx(forecastTooltipStyles.gridColumn, forecastTooltipStyles.subtleText)}>
            <Text variant="p4semi">APY</Text>
          </div>

          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.firstColumn,
            )}
          >
            <SvgCircle color="rgba(255, 73, 164, 0.3)" />
            <Text variant="p3semi">Upper bound</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            <Text variant="p3semi">${formatCryptoBalance(upperBound)}</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            -
          </div>

          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.firstColumn,
            )}
          >
            <SvgCircle color="#FF80BF" />
            <Text variant="p3semi">Median</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            <Text variant="p3semi">${formatCryptoBalance(forecast)}</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            -
          </div>

          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.firstColumn,
            )}
          >
            <SvgCircle color="rgba(255, 73, 164, 0.3)" />
            <Text variant="p3semi">Lower bound</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            <Text variant="p3semi">${formatCryptoBalance(lowerBound)}</Text>
          </div>
          <div
            className={clsx(
              forecastTooltipStyles.gridColumnValue,
              forecastTooltipStyles.gridColumn,
            )}
          >
            -
          </div>
        </SimpleGrid>
      </div>
    )
  }

  return null
}
