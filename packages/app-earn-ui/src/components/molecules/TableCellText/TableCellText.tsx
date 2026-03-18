import { type CSSProperties, type FC, type HTMLAttributes, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

interface TableCellTextProps {
  children: ReactNode
  style?: CSSProperties
  suppressHydrationWarning?: boolean
  small?: boolean
  as?: 'p' | 'span' | 'div'
  className?: string
}

export const TableCellText: FC<TableCellTextProps & HTMLAttributes<HTMLElement>> = ({
  children,
  style = {},
  suppressHydrationWarning,
  small = false,
  as = 'p',
  className,
  ...rest
}) => (
  <Text
    as={as}
    variant={small ? 'p4semi' : 'p3semi'}
    style={{ color: 'var(--earn-protocol-secondary-100)', userSelect: 'none', ...style }}
    suppressHydrationWarning={suppressHydrationWarning}
    className={className}
    {...rest}
  >
    {children}
  </Text>
)
