import { type FC, forwardRef, useEffect, useState } from 'react' // Import forwardRef
import clsx from 'clsx'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

import styles from './Card.module.css'

export interface CardProps {
  apy: number
  trendData: { x: number; y: number }[]
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  highlight?: boolean
  apyColorOverride?: string
  'data-card-index'?: number // Keep data attribute
}

// Use forwardRef to pass the ref to the underlying div
const Card: FC<CardProps> = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      apy,
      trendData,
      selected,
      onClick,
      highlight,
      apyColorOverride,
      'data-card-index': dataCardIndex,
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
      setVisible(true)

      return () => setVisible(false)
    }, [])

    let apyColor = apyColorOverride || '#1a2233'
    let apyFontSize = 20

    if (apy >= 10) {
      apyFontSize = 24 // bigger for high yield
    } else if (apy <= 3 && !apyColorOverride) {
      apyColor = '#d7263d' // red for very low yield
    } else if (apy <= 5 && !apyColorOverride) {
      // interpolate between red and dark for low yields
      apyColor = 'rgb(120,40,40)'
    }

    return (
      <div
        ref={ref} // Assign the forwarded ref here
        data-card-index={dataCardIndex} // Keep data attribute
        className={clsx(
          styles.card,
          selected && styles.selected,
          highlight && styles.highlight,
          hovered && styles.hovered,
          !visible && styles.invisible,
        )}
        tabIndex={0}
        onClick={onClick} // Pass the event directly
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (onClick) {
              const syntheticMouseEvent = {
                ...e,
                type: 'click',
                button: 0,
              } as unknown as React.MouseEvent<HTMLDivElement>

              onClick(syntheticMouseEvent)
            }
          }
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) =>
          (e.currentTarget.style.transform = selected
            ? 'scale(1.09)'
            : highlight
              ? 'scale(1.05)'
              : hovered
                ? 'scale(1.04)'
                : 'scale(1)')
        }
        onMouseLeave={(e) => {
          setHovered(false)
          e.currentTarget.style.transform = selected
            ? 'scale(1.09)'
            : highlight
              ? 'scale(1.05)'
              : 'scale(1)'
        }}
        onMouseEnter={() => setHovered(true)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div style={{ width: '100%', height: 36 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <Line
                type="monotone"
                dataKey="y"
                stroke={apyColor}
                dot={false}
                strokeWidth={2}
                animationDuration={100}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.apyValue} style={{ fontSize: apyFontSize, color: apyColor }}>
          {apy.toFixed(2)}%
        </div>
      </div>
    )
  },
)

Card.displayName = 'Card' // Add display name for DevTools

export default Card
