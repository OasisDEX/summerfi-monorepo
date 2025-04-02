import { type CSSProperties, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

type EmphasisProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  variant?:
    | 'h4colorful'
    | 'h3colorful'
    | 'h2colorful'
    | 'h1colorful'
    | 'p1colorful'
    | 'p2colorful'
    | 'p3colorful'
    | 'p4colorful'
    | 'p1semiColorful'
    | 'p2semiColorful'
    | 'p3semiColorful'
    | 'p4semiColorful'
}

export const Emphasis = ({
  children,
  variant = 'h4colorful',
  className,
  style,
}: EmphasisProps): React.ReactNode => (
  <Text variant={variant} as="span" className={className} style={style}>
    {children}
  </Text>
)
