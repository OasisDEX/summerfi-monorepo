import { type CategoricalChartState } from 'recharts/types/chart/types'

export const ChartCross = ({
  activeTooltipIndex,
  tooltipTicks,
  formattedGraphicalItems,
  offset,
  graphicalItemIndex,
  ...rest
}: CategoricalChartState & {
  graphicalItemIndex?: number
}) => {
  // custom component for showing our 'crosshair' on the chart

  if (
    offset &&
    tooltipTicks &&
    activeTooltipIndex &&
    formattedGraphicalItems[graphicalItemIndex ?? 0]?.props.points[activeTooltipIndex]
  ) {
    if (!rest.isTooltipActive) {
      return null
    }
    // taking the active point by active tooltip index (same count as points)
    // kinda hacky, but it works for now, we might revisit that later
    const { x, y } =
      formattedGraphicalItems[graphicalItemIndex ?? 0].props.points[activeTooltipIndex]
    const pointProps = { cx: x, cy: y }

    return (
      <>
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={`calc(100% - ${offset.bottom}px)`}
          stroke="#FF80BF"
          strokeWidth={2}
          strokeDasharray="5 10"
        />
        <line
          x1={offset.left}
          y1={y}
          x2={`calc(100% - ${offset.right}px)`}
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
