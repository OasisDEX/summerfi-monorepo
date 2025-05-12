import clsx from 'clsx'

import loadingSpinnerStyles from '@/components/molecules/LoadingSpinner/LoadingSpinner.module.css'

const DEFAULT_SIZE = 24

export const LoadingSpinner = ({
  className,
  size = DEFAULT_SIZE,
  fast = false,
  color = 'var(--color-text-primary)',
  strokeWidth = 2,
  style,
  appear,
  gradient,
}: {
  className?: string
  size?: number
  fast?: boolean
  /** @default var(--color-text-primary) */
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
  appear?: boolean
  gradient?: {
    id: string
    stops: { offset: string; color: string }[]
  }
}): React.ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={gradient ? `url(#${gradient.id})` : 'currentColor'}
    color={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={clsx(className, {
      [loadingSpinnerStyles.animateSpinFastAppear]: fast && appear,
      [loadingSpinnerStyles.animateSpinAppear]: !fast && appear,
      [loadingSpinnerStyles.animateSpinFast]: fast,
      [loadingSpinnerStyles.animateSpin]: !fast,
    })}
  >
    {gradient && (
      <defs>
        <linearGradient id={gradient.id}>
          {gradient.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
    )}
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)
