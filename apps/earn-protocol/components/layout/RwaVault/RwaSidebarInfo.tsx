import { Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import balanceLogo from '@/public/img/private-markets/logo_balance.svg'
import summerFiLogo from '@/public/img/private-markets/logo_summer.svg'
import utilaLogo from '@/public/img/private-markets/logo_utila.svg'

export const RwaSidebarInfo = () => {
  return (
    <Card
      style={{ flexDirection: 'column', gap: 'var(--general-space-16)' }}
      variant="cardSecondary"
    >
      <Text as="p" variant="h5">
        Access through trusted sources
      </Text>

      <Card
        variant="cardPrimary"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-12)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image alt="Utila" src={utilaLogo} style={{ maxHeight: '22px', maxWidth: '100px' }} />
          <Link href="#" target="_blank" rel="noreferrer" style={{ marginRight: '16px' }}>
            <WithArrow as="p" variant="p3semi">
              Visit Utilia
            </WithArrow>
          </Link>
        </div>
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          An enterprise-grade, non-custodial MPC wallet that empowers institutions to manage digital
          assets across multiple chains.
        </Text>
      </Card>

      <Card
        variant="cardPrimary"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-12)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image alt="Balance" src={balanceLogo} style={{ maxHeight: '22px', maxWidth: '100px' }} />
          <Link href="#" target="_blank" rel="noreferrer" style={{ marginRight: '16px' }}>
            <WithArrow as="p" variant="p3semi">
              Visit Balance
            </WithArrow>
          </Link>
        </div>
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          Regulated operating system for institutions to securely store, manage, and settle both
          digital assets and fiat across North America.
        </Text>
      </Card>

      <Card
        variant="cardPrimary"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-12)' }}
      >
        <Image
          alt="Summer.fi"
          src={summerFiLogo}
          style={{ maxHeight: '22px', maxWidth: '100px' }}
        />
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          If you are not a user of one of the above Custodians or Wallet Providers, you can still
          get access to the RWA Vaults through Summer.fi. Please contact our institutional team{' '}
          <Link
            href="mailto:institutional@summer.fi"
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          >
            here
          </Link>{' '}
          to find out more.
        </Text>
      </Card>
    </Card>
  )
}
