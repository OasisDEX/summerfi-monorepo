import type { FC } from 'react'
import { Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

interface TransakFootNoteLinkProps {
  label: string
  href: string
  withArrow?: boolean
}

export const TransakFootNoteLink: FC<TransakFootNoteLinkProps> = ({
  label,
  href,
  withArrow = true,
}) => (
  <Link href={href} target="_blank">
    {withArrow && (
      <WithArrow withStatic style={{ color: 'var(--earn-protocol-primary-100)' }} variant="p3semi">
        {label}
      </WithArrow>
    )}
    {!withArrow && (
      <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
        {label}
      </Text>
    )}
  </Link>
)
