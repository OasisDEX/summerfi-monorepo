import { type CSSProperties, type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

interface TableCellTextProps {
  children: ReactNode
  style?: CSSProperties
  suppressHydrationWarning?: boolean
  small?: boolean
}

export const TableCellText: FC<TableCellTextProps> = ({
  children,
  style = {},
  suppressHydrationWarning,
  small = false,
}) => (
  <Text
    as="p"
    variant={small ? 'p4semi' : 'p3semi'}
    style={{ color: 'var(--earn-protocol-secondary-100)', ...style }}
    suppressHydrationWarning={suppressHydrationWarning}
  >
    {children}
  </Text>
)
