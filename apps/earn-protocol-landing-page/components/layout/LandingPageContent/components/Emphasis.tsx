import { type ReactNode } from 'react'
import { Text } from '@summerfi/app-earn-ui'

type EmphasisProps = { children: ReactNode; variant?: 'h4colorful' | 'h3colorful' }

export const Emphasis = ({ children, variant = 'h4colorful' }: EmphasisProps) => (
  <Text variant={variant} as="span">
    {children}
  </Text>
)
