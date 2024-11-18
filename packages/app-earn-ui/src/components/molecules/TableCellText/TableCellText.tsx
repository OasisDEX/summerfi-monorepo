import { type CSSProperties, type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

interface TableCellTextProps {
  children: ReactNode
  style?: CSSProperties
  suppressHydrationWarning?: boolean
}

export const TableCellText: FC<TableCellTextProps> = ({
  children,
  style = {},
  suppressHydrationWarning,
}) => (
  <Text
    as="p"
    variant="p3"
    style={{ color: 'var(--earn-protocol-secondary-100)', ...style }}
    suppressHydrationWarning={suppressHydrationWarning}
  >
    {children}
  </Text>
)
