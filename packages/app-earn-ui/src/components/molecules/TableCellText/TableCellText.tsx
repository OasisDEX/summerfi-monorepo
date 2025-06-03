import { type CSSProperties, type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

interface TableCellTextProps {
  children: ReactNode
  style?: CSSProperties
  suppressHydrationWarning?: boolean
  small?: boolean
  as?: 'p' | 'span' | 'div'
}

export const TableCellText: FC<TableCellTextProps> = ({
  children,
  style = {},
  suppressHydrationWarning,
  small = false,
  as = 'p',
}) => (
  <Text
    as={as}
    variant={small ? 'p4semi' : 'p3semi'}
    style={{ color: 'var(--earn-protocol-secondary-100)', userSelect: 'none', ...style }}
    suppressHydrationWarning={suppressHydrationWarning}
  >
    {children}
  </Text>
)
