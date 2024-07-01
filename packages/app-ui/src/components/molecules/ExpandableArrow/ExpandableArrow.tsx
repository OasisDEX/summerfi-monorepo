type ArrowDirectionType = 'up' | 'down'

export interface ExpandableArrowProps {
  adaptSize?: boolean
  color?: string
  direction: ArrowDirectionType
  size?: number
  style?: React.CSSProperties
}

export function ExpandableArrow({
  adaptSize,
  color = 'primary100',
  direction,
  size = 10,
  style,
}: ExpandableArrowProps) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '1em',
        height: '0.64705em',
        fontSize: `${size}${adaptSize ? 'em' : 'px'}`,
        transform: direction === 'down' ? 'none' : 'translate(0, -0.35294em)',
        transition: 'transform 200ms',
        ...style,
      }}
    >
      {/** before */}
      <span
        style={{
          content: '""',
          position: 'absolute',
          top: '-0.14764em',
          left: '0.41176em',
          width: '0.17647em',
          height: '0.58823em',
          borderBottom: '0.75588em solid',
          transition: 'transform 200ms, border-color 200ms',
          borderBottomColor: color,
          transform: direction === 'down' ? 'rotate(-135deg)' : 'rotate(-45deg)',
        }}
      />
      {/** after */}
      <span
        style={{
          content: '""',
          position: 'absolute',
          top: '-0.14764em',
          left: '0.41176em',
          width: '0.17647em',
          height: '0.58823em',
          borderBottom: '0.75588em solid',
          transition: 'transform 200ms, border-color 200ms',
          borderBottomColor: color,
          transform: direction === 'down' ? 'rotate(135deg)' : 'rotate(45deg)',
        }}
      />
    </span>
  )
}
