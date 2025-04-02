export const Divider = ({
  vertical = false,
  style,
}: {
  vertical?: boolean
  style?: React.CSSProperties
}): React.ReactNode => {
  return (
    <div
      style={{
        width: vertical ? '1px' : '100%',
        height: vertical ? '100%' : '1px',
        backgroundColor: 'var(--color-neutral-20)',
        ...style,
      }}
    />
  )
}
