import { useMemo } from 'react'
import { useIsTooltipActive, useOffset } from 'recharts'

type CursorOrDotProps = {
  payload?: {
    dataKey: string
    [key: string]: unknown
  }[]
  points?: { x: number; y: number }[] | string
  coordinateDataKeySelector: string
  cx?: number
  cy?: number
  [key: string]: unknown
}

export const ChartCross = ({
  payload,
  points,
  coordinateDataKeySelector,
  cx,
  cy,
}: CursorOrDotProps) => {
  const isTooltipActive = useIsTooltipActive()
  const offset = useOffset()

  // When rendered as Line.activeDot we get cx/cy directly and skip tooltip logic
  const pointCoordinates = useMemo(() => {
    if (typeof cx === 'number' && typeof cy === 'number') {
      return { x: cx, y: cy }
    }

    if (!isTooltipActive || !points || !payload) return null

    const targetIndex = payload.findIndex((p) => p.dataKey === coordinateDataKeySelector)

    if (targetIndex === -1) return null

    if (!Array.isArray(points)) return null

    return points[targetIndex]
  }, [coordinateDataKeySelector, cx, cy, isTooltipActive, payload, points])

  if (pointCoordinates && isTooltipActive) {
    const { x, y } = pointCoordinates
    const pointProps = { cx: x, cy: y }

    return (
      <>
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={offset ? `calc(100% - ${offset.bottom}px)` : '100%'}
          stroke="#FF80BF"
          strokeWidth={2}
          strokeDasharray="5 10"
        />
        <line
          x1={offset ? offset.left : 0}
          y1={y}
          x2={offset ? `calc(100% - ${offset.right}px)` : '100%'}
          y2={y}
          stroke="#FF49A4"
          strokeWidth={2}
          strokeDasharray="5 10"
          style={{ opacity: 0.5 }}
        />
        <circle {...pointProps} r="8" fill="#FFFBFD" />
        <circle {...pointProps} r="13" fill="#FFFBFD" style={{ opacity: 0.2 }} />
      </>
    )
  }

  return null
}
