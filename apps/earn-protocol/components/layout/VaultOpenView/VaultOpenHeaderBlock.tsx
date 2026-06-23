import { type FC } from 'react'
import { getVaultDetailsUrl, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { slugify } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import { DaoManagedInfoBlock } from '@/components/molecules/DaoManagedInfoBlock/DaoManagedInfoBlock'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import apolloMarketLogo from '@/public/img/private-markets/apollo.png'
import franklinTempletonMarketLogo from '@/public/img/private-markets/franklin_templeton.png'
import mapleMarketLogo from '@/public/img/private-markets/maple.png'
import securitizeMarketLogo from '@/public/img/private-markets/securitize.png'
import stacMarketLogo from '@/public/img/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/private-markets/superstate.png'
import vaneckMarketLogo from '@/public/img/private-markets/vaneck.png'
import wisdomTreeMarketLogo from '@/public/img/private-markets/wisdomtree.png'

interface VaultOpenHeaderBlockProps {
  vault?: SDKVaultishType
  detailsLinks: { label: string; id?: string; url?: string }[]
  isDaoManaged?: boolean
  isRwaVault?: boolean
}

const marketLogoMap = {
  apollo: apolloMarketLogo,
  franklinTempleton: franklinTempletonMarketLogo,
  maple: mapleMarketLogo,
  securitize: securitizeMarketLogo,
  stac: stacMarketLogo,
  superstate: superstateMarketLogo,
  wisdomTree: wisdomTreeMarketLogo,
  vaneck: vaneckMarketLogo,
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
          <Text as="p" variant="p3semi">
            Seamlessly earn onchain yield from the highest quality RWA markets.
          </Text>
          {vault?.customFields?.vaultHeaderDescription ? (
            <Text as="p" variant="p3">
              {vault.customFields.vaultHeaderDescription}
            </Text>
          ) : null}
          {vault?.customFields?.vaultMarketLogos?.length ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                rowGap: 'var(--spacing-space-medium)',
                columnGap: 'var(--spacing-space-large)',
                marginTop: 'var(--spacing-space-large)',
                marginBottom: 'var(--spacing-space-large)',
              }}
            >
              {vault.customFields.vaultMarketLogos
                .map((logoKey) => ({
                  logoKey,
                  logo: marketLogoMap[logoKey as keyof typeof marketLogoMap],
                }))
                .filter(({ logo }) => Boolean(logo))
                .map(({ logoKey, logo }) => (
                  <Image
                    key={logoKey}
                    src={logo}
                    alt={`${logoKey} market logo`}
                    style={{ width: 'auto', maxWidth: '20%', height: '28px', objectFit: 'contain' }}
                  />
                ))}
            </div>
          ) : null}
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
