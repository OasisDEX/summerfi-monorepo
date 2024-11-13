import clsx from 'clsx'

import loadingSpinnerStyles from '@/components/molecules/LoadingSpinner/LoadingSpinner.module.scss'

const DEFAULT_SIZE = 24

export const LoadingSpinner = ({
  className,
  size = DEFAULT_SIZE,
  fast = false,
  color = 'var(--color-text-primary)',
  style,
  appear,
}: {
  className?: string
  size?: number
  fast?: boolean
  /** @default var(--color-text-primary) */
  color?: string
  style?: React.CSSProperties
  appear?: boolean
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    color={color}
    strokeWidth="2"
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)
