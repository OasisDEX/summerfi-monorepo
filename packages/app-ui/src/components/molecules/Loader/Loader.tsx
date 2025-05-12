import clsx from 'clsx'

import loaderStyles from '@/components/molecules/Loader/Loader.module.css'

const DEFAULT_SIZE = 24

export const LoadingSpinner = ({
  className,
  size = DEFAULT_SIZE,
  fast = false,
  color = 'var(--color-primary-100)',
  style,
}: {
  className?: string
  size?: number
  fast?: boolean
  /** @default var(--color-primary-100) */
  color?: string
  style?: React.CSSProperties
}): React.ReactNode => (
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
    className={clsx(loaderStyles.animateSpin, className, {
      [loaderStyles.animateSpinFast]: fast,
    })}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)
