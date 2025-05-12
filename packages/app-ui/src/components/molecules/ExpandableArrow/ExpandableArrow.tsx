import expandableArrowStyles from './ExpandableArrow.module.css'

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
}: ExpandableArrowProps): React.ReactNode {
  const isDown = direction === 'down'

  return (
    <span
      className={expandableArrowStyles.wrapper}
      style={{
        fontSize: `${size}${adaptSize ? 'em' : 'px'}`,
        transform: isDown ? 'none' : 'translate(0, -0.35294em)',
        ...style,
      }}
    >
      <span
        className={expandableArrowStyles.arrow}
        style={{
          borderBottomColor: color,
          transform: isDown ? 'rotate(-135deg)' : 'rotate(-45deg)',
          top: !isDown ? '0.14764em' : 0,
          left: '3px',
        }}
      />
      <span
        className={expandableArrowStyles.arrow}
        style={{
          borderBottomColor: color,
          transform: isDown ? 'rotate(135deg)' : 'rotate(45deg)',
          top: !isDown ? '0.14764em' : 0,
          left: '-3px',
        }}
      />
    </span>
  )
}
