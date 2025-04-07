import { type FC } from 'react'
import { getVaultDetailsUrl, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import Link from 'next/link'

interface VaultOpenHeaderBlockProps {
  vault?: SDKVaultishType
  detailsLinks: { label: string; id: string }[]
}

export const VaultOpenHeaderBlock: FC<VaultOpenHeaderBlockProps> = ({ detailsLinks, vault }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-space-medium)',
      }}
    >
      <Text variant="h5">About the vault</Text>
      <Text
        variant="p2"
        style={{
          color: 'var(--color-text-secondary)',
        }}
      >
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--general-space-24)',
        }}
      >
        {detailsLinks.map(({ label, id }) => (
          <Link key={label} href={`${getVaultDetailsUrl(vault)}#${id}`}>
            <Text
              as="p"
              variant="p3semi"
              style={{
                color: 'var(--color-text-link)',
                textDecoration: 'none',
                cursor: 'pointer',
                paddingRight: 'var(--spacing-space-medium)',
              }}
            >
              <WithArrow>{label}</WithArrow>
            </Text>
          </Link>
        ))}
      </div>
    </div>
  )
}
