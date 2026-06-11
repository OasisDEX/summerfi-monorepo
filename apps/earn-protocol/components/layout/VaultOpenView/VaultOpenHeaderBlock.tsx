import { type FC } from 'react'
import { getVaultDetailsUrl, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { slugify } from '@summerfi/app-utils'
import Link from 'next/link'

import { DaoManagedInfoBlock } from '@/components/molecules/DaoManagedInfoBlock/DaoManagedInfoBlock'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

interface VaultOpenHeaderBlockProps {
  vault?: SDKVaultishType
  detailsLinks: { label: string; id: string }[]
  isDaoManaged?: boolean
  isRwaVault?: boolean
}

export const VaultOpenHeaderBlock: FC<VaultOpenHeaderBlockProps> = ({
  detailsLinks,
  vault,
  isDaoManaged = false,
  isRwaVault = false,
}) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()

  const resolveHeader = () => {
    if (isRwaVault) {
      return 'About the strategy'
    }
    if (isDaoManaged) {
      return 'What are DAO Risk-Managed Vaults? '
    }

    return 'About the vault'
  }

  const resolveDescription = () => {
    if (isRwaVault) {
      return (
        <>
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            The Permissioned RWA Vault on the Lazy Summer Protocol offers real yield from a basket
            of underlying tokenized RWAs and private credit markets. Unlike many RWA yield options
            in DeFi, this yield comes directly from the assets and not from borrowing demand for
            looping.
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            Because the Vault contains permissioned assets, access is restricted to those that meet
            certain requirements and complete KYC and AML checks. The good news with this Vault is
            that if you are a customer of one of our trusted partners, such as Utila and Balance,
            you can access the Vault straight away from their app or web interface with no
            additional checks or hoops to jump through. Similarly, if you would like to access the
            Vault through Summer.fi, you can perform these checks just once and get access to the
            yield from all of the underlying markets that are available. Just reach out to the
            Summer.fi Institutional team{' '}
            <Link
              href="mailto:institutions@summer.fi"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
            >
              here
            </Link>{' '}
            to find out more.
          </Text>
        </>
      )
    }
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
        {detailsLinks.map(({ label, id }) => (
          <Link
            key={label}
            href={`${getVaultDetailsUrl(vault)}#${id}`}
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
