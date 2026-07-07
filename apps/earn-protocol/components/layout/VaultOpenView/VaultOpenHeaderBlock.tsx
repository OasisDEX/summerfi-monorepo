import { type FC } from 'react'
import { getVaultDetailsUrl, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { slugify } from '@summerfi/app-utils'
import Link from 'next/link'

import { DaoManagedInfoBlock } from '@/components/molecules/DaoManagedInfoBlock/DaoManagedInfoBlock'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

interface VaultOpenHeaderBlockProps {
  vault?: SDKVaultishType
  detailsLinks: { label: string; id?: string; url?: string }[]
  isDaoManaged?: boolean
}

export const VaultOpenHeaderBlock: FC<VaultOpenHeaderBlockProps> = ({
  detailsLinks,
  vault,
  isDaoManaged = false,
}) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()

  const resolveHeader = () => {
    if (isDaoManaged) {
      return 'What are DAO Risk-Managed Vaults? '
    }

    return 'About the vault'
  }

  const resolveDescription = () => {
    if (isDaoManaged) {
      return (
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          DAO Risk-Managed Vaults offer high risk/reward yield from DeFi’s highest quality
          protocols. Yield sources undergo a screening process and then are subject to a risk
          framework that determines how much capital can be allocated to any one yield source at a
          time. Optimizing for higher risk/reward.
        </Text>
      )
    }

    return (
      <Text
        as="p"
        variant="p2"
        style={{
          color: 'var(--color-text-secondary)',
        }}
      >
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-space-medium)',
      }}
    >
      <Text variant="h5">{resolveHeader()}</Text>
      {resolveDescription()}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--general-space-24)',
        }}
      >
        {detailsLinks.map(({ label, id, url }) => (
          <Link
            key={label}
            href={url ?? `${getVaultDetailsUrl(vault)}#${id}`}
            onClick={() => buttonClickEventHandler(`vault-open-details-${slugify(label)}`)}
          >
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
      {isDaoManaged && <DaoManagedInfoBlock />}
    </div>
  )
}
