export const SimpleGrid = ({
  children,
  className,
  style,
  columns = 1,
  rows = 1,
  gap = 8,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  columns?: number
  rows?: number
  gap?: number | string
}): React.ReactNode => {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: Array(columns).fill('1fr').join(' ').trim(),
        gridTemplateRows: Array(rows).fill('1fr').join(' ').trim(),
        gap: typeof gap === 'string' ? gap : `${gap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
