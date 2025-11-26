import { useMemo, useState } from 'react'
import {
  type ChartsDataTimeframes,
  type TimeframesItem,
  type TimeframesType,
} from '@summerfi/app-types'

import { POINTS_REQUIRED_FOR_CHART } from '@/features/charts/helpers'

export const allTimeframesAvailable = {
  '7d': true,
  '30d': true,
  '90d': true,
  '6m': true,
  '1y': true,
  '3y': true,
}

export const allTimeframesNotAvailable = {
  '7d': false,
  '30d': false,
  '90d': false,
  '6m': false,
  '1y': false,
  '3y': false,
}

type UseTimeframesProps = {
  chartData?: ChartsDataTimeframes
  customDefaultTimeframe?: TimeframesType
}

export const useTimeframes = ({ chartData, customDefaultTimeframe }: UseTimeframesProps) => {
  const timeframes = useMemo(() => {
    if (!chartData) {
      return {} as TimeframesItem
    }

    return Object.keys(chartData).reduce<TimeframesItem>((acc, key) => {
      const keyTyped = key as keyof ChartsDataTimeframes

      if (keyTyped === '7d') {
        // we always want to show 7d
        return {
          ...acc,
          [keyTyped]: true,
        }
      }

      return {
        ...acc,
        [keyTyped]:
          chartData[keyTyped].filter((dataPoint) => {
            // we dont want to include forecast data
            return !dataPoint.forecast
          }).length > POINTS_REQUIRED_FOR_CHART[keyTyped],
      }
    }, allTimeframesNotAvailable)
  }, [chartData])

  // if 90d isnt available, default to 7d
  const [timeframe, setTimeframe] = useState<TimeframesType>(
    customDefaultTimeframe ? customDefaultTimeframe : timeframes['90d'] ? '90d' : '7d',
  )

  // Zoom state management
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomedData, setZoomedData] = useState<unknown[]>([])

  // Selection state management
  const [isSelectingZoom, setIsSelectingZoom] = useState(false)
  const [selectionZoomStart, setSelectionZoomStart] = useState<number | null>(null)
  const [selectionZoomEnd, setSelectionZoomEnd] = useState<number | null>(null)

  const handleZoom = (
    data: unknown[],
    startIndex: number | undefined,
    endIndex: number | undefined,
  ) => {
    if (startIndex !== undefined && endIndex !== undefined) {
      const zoomed = data.slice(startIndex, endIndex + 1)

      setZoomedData(zoomed)
      setIsZoomed(true)
    }
  }

  const createSelectionHandlers = (data: unknown[]) => {
    const handleMouseDown = (ev: unknown) => {
      const evt = ev as { activeLabel?: string }

      if (evt.activeLabel && !isZoomed) {
        // We don't know the type of data, so we use any here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index = data.findIndex((item: any) => item.timestamp === evt.activeLabel)

        if (index !== -1) {
          setIsSelectingZoom(true)
          setSelectionZoomStart(index)
          setSelectionZoomEnd(index)
        }
      }
    }

    const handleMouseMove = (ev: unknown) => {
      const evt = ev as { activeLabel?: string }

      if (isSelectingZoom && evt.activeLabel) {
        // We don't know the type of data, so we use any here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index = data.findIndex((item: any) => item.timestamp === evt.activeLabel)

        if (index !== -1) {
          setSelectionZoomEnd(index)
        }
      }
    }

    const handleMouseUp = () => {
      if (isSelectingZoom && selectionZoomStart !== null && selectionZoomEnd !== null) {
        const startIndex = Math.min(selectionZoomStart, selectionZoomEnd)
        const endIndex = Math.max(selectionZoomStart, selectionZoomEnd)

        if (startIndex !== endIndex) {
          handleZoom(data, startIndex, endIndex)
        }
      }

      setIsSelectingZoom(false)
      setSelectionZoomStart(null)
      setSelectionZoomEnd(null)
    }

    return { handleMouseDown, handleMouseMove, handleMouseUp }
  }

  const handleResetZoom = () => {
    setIsZoomed(false)
    setZoomedData([])
  }

  return {
    timeframes,
    timeframe,
    setTimeframe,
    isZoomed,
    zoomedData,
    handleZoom,
    handleResetZoom,
    isSelectingZoom,
    selectionZoomStart,
    selectionZoomEnd,
    createSelectionHandlers,
  }
}
