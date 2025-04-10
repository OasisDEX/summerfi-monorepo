import { type CSSProperties, type FC } from 'react'

interface TableRowAccentProps {
  style?: CSSProperties
  backgroundColor: string
}

export const TableRowAccent: FC<TableRowAccentProps> = ({ backgroundColor, style }) => (
  <div
    style={{
      height: '42px',
      width: '2px',
      backgroundColor,
      ...style,
    }}
  />
)
