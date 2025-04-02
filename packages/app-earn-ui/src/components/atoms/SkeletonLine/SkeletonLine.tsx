import skeletonStyles from '@/components/atoms/SkeletonLine/SkeletonLine.module.scss'

interface SkeletonProps {
  circle?: boolean
  cols?: number
  count?: number
  doughnut?: string | number
  gap?: string | number
  height?: string | number
  radius?: string
  width?: string | number
  style?: React.CSSProperties
}

export const SkeletonLine = ({
  circle = false,
  doughnut,
  radius = 'var(--general-radius-50)',
  width = '100%',
  height = 3,
  style,
}: Omit<SkeletonProps, 'cols' | 'count' | 'gap'>): React.ReactNode => {
  return (
    <span
      className={skeletonStyles.skeletonLine}
      style={{
        position: 'relative',
        display: 'block',
        width,
        height,
        borderRadius: circle || doughnut ? 'var(--general-radius-50)' : radius,
        overflow: 'hidden',
        ...style,
      }}
    >
      {doughnut && (
        <span
          style={{
            position: 'absolute',
            top: doughnut,
            right: doughnut,
            bottom: doughnut,
            left: doughnut,
            display: 'block',
            background: 'neutral10',
            borderRadius: 'var(--radius-circle)',
            zIndex: 1,
          }}
        />
      )}
    </span>
  )
}
