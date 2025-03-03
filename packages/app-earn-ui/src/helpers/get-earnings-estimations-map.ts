import { type ForecastData } from '@summerfi/app-types'
import dayjs, { type Dayjs } from 'dayjs'

export type EarningsEstimationsMap = {
  '30d': {
    forecast: number
    lowerBound: number
    upperBound: number
  }
  '6m': {
    forecast: number
    lowerBound: number
    upperBound: number
  }
  '1y': {
    forecast: number
    lowerBound: number
    upperBound: number
  }
  '3y': {
    forecast: number
    lowerBound: number
    upperBound: number
  }
}

const emptyMap = {
  forecast: 0,
  lowerBound: 0,
  upperBound: 0,
}

export const getEarningsEstimationsMap = ({
  forecast: forecastData,
  inputValue,
}: {
  forecast?: ForecastData
  inputValue: string
}): EarningsEstimationsMap => {
  if (inputValue === '0' || !forecastData) {
    return {
      '30d': emptyMap,
      '6m': emptyMap,
      '1y': emptyMap,
      '3y': emptyMap,
    }
  }

  const getPointInTime = (time: Dayjs) => {
    const point = forecastData.dataPoints.daily.find((p) => {
      return (
        time.format('YYYY-MM-DD') === p.timestamp ||
        time.subtract(1, 'day').format('YYYY-MM-DD') === p.timestamp // 3y needs -1 day
      )
    })

    if (!point) {
      return emptyMap
    }
    const {
      bounds: [lowerBound, upperBound],
      forecast,
    } = point

    return {
      forecast,
      lowerBound,
      upperBound,
    }
  }

  return {
    '30d': getPointInTime(dayjs().add(30, 'day').startOf('day')),
    '6m': getPointInTime(dayjs().add(6, 'month').startOf('day')),
    '1y': getPointInTime(dayjs().add(1, 'year').startOf('day')),
    '3y': getPointInTime(
      dayjs()
        .add(3 * 365, 'day') // 3y in frontend is not exactly 3y in the backend...
        .startOf('day'),
    ),
  }
}
