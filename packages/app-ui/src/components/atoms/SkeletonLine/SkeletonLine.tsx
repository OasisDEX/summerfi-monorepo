import skeletonStyles from '@/components/atoms/SkeletonLine/SkeletonLine.module.scss'

type SkeletonColorTheme =
  | 'default'
  | 'dark'
  | 'positive'
  | 'negative'
  | 'fancy'
  | 'ajna'
  | 'interactive'

type SkeletonColorThemes = {
  [key in SkeletonColorTheme]: [string, string]
}

interface SkeletonProps {
  circle?: boolean
  color?: SkeletonColorTheme
  cols?: number
  count?: number
  doughnut?: string | number
  gap?: string | number
  height?: string | number
  radius?: string
  width?: string | number
}

const skeletonColorTheme: SkeletonColorThemes = {
  dark: ['#dae1e4', '#ecf2f5'],
  default: ['#e6e9eb', '#f8f7f9'],
  negative: ['#ffeee9', '#fff9f7'],
  positive: ['#e7fcfa', '#f7fefd'],
  fancy: ['#ccf1fc', '#fcece3'], // based on the two main summer colors: #007DA3 + #E7A77F
  ajna: ['#fcddf8', '#eadcfb'], // based on the ajna brand gradient colors: #f154db + #974eea
  interactive: ['#D8D9FE', '#EDEDFF'], // interactive 30 & 10
}

export const SkeletonLine = ({
  circle = false,
  color = 'default',
  doughnut,
  radius = 'var(--radius-50)',
  width = '100%',
  height = 3,
}: Omit<SkeletonProps, 'cols' | 'count' | 'gap'>): React.ReactNode => {
  const theme = skeletonColorTheme[color]

  return (
    <span
      className={skeletonStyles.skeletonLine}
      style={{
        position: 'relative',
        display: 'block',
        width,
        height,
        borderRadius: circle || doughnut ? 'var(--radius-50)' : radius,
        backgroundColor: theme[0],
        overflow: 'hidden',
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
