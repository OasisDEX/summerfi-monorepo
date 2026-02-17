import { type CSSProperties, type ReactNode } from 'react'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

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
    | 'h1colorfulBeachClub'
    | 'h2colorfulBeachClub'
    | 'h3colorfulBeachClub'
    | 'h4colorfulBeachClub'
    | 'p1colorfulBeachClub'
    | 'p1semiColorfulBeachClub'
    | 'p2colorfulBeachClub'
    | 'p2semiColorfulBeachClub'
    | 'p3colorfulBeachClub'
    | 'p3semiColorfulBeachClub'
    | 'p4colorfulBeachClub'
    | 'p4semiColorfulBeachClub'
  as?: TextAllowedHtmlTags
}

export const Emphasis = ({
  children,
  variant = 'h4colorful',
  className,
  style,
  as,
}: EmphasisProps): React.ReactNode => (
  <Text variant={variant} as={as ?? 'span'} className={className} style={style}>
    {children}
  </Text>
)
