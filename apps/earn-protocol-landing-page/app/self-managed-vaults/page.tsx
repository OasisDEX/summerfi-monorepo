'use client'
import { Audits, Emphasis, Icon, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {
  SelfManagedVaultsBox1Background,
  SelfManagedVaultsBox2Background,
} from '@/app/self-managed-vaults/background'
import { TagButton } from '@/components/atoms/TagButton'
import { HeroWrapper } from '@/components/layout/HeroWrapper/HeroWrapper'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { SubLandingPageSection } from '@/components/layout/SubLandingPageSection/SubLandingPageSection'
import { FractalGlassBackground } from '@/components/molecules/FractalGlassBackground/FractalGlassBackground'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'

import selfManagedVaultsStyles from './SelfManagedVaults.module.css'

import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'

export default function SelfManagedVaults() {
  const pathname = usePathname()
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-self-managed-vaults-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  return (
    <>
      <HeroWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className={selfManagedVaultsStyles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
        <div
          style={{
            maxWidth: '1200px',
            textAlign: 'left',
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-small)',
          }}
        >
          <TagButton>Self Managed Vaults</TagButton>
          <Text variant="h1">
            <Emphasis variant="h1colorful">Unlimited access to DeFi yield,</Emphasis> built for
            forward thinking institutions
          </Text>
          <Text
            variant="p1"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            Self managed vaults by Summer.fi Institutional enable institutions to build their own
            custom vault.
          </Text>
        </div>
      </HeroWrapper>
      <SubLandingPageSection>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-space-medium)',
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-space-x-small)',
              borderRadius: '32px',
              border: '1px solid #232323',
              padding: 'var(--spacing-space-2x-large)',
            }}
          >
            <SelfManagedVaultsBox1Background />
            <Text variant="h4">Build your own onchain yield vault in weeks not months</Text>
            <Text
              variant="p1"
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-space-large)',
              }}
            >
              DAO risk managed vaults from Lazy Summer keeps your capital continuously allocated to
              DeFi’s highest performing strategies.
            </Text>
            <div className={selfManagedVaultsStyles.infoGridItem}>
              <div className={selfManagedVaultsStyles.infoGridBullet} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="p2" className={selfManagedVaultsStyles.infoGridTitle}>
                  Wisdom tree
                </Text>
              </div>
            </div>
            <div className={selfManagedVaultsStyles.infoGridItem}>
              <div className={selfManagedVaultsStyles.infoGridBullet} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="p2" className={selfManagedVaultsStyles.infoGridTitle}>
                  Maple
                </Text>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              flexDirection: 'column',
              gap: 'var(--spacing-space-x-small)',
              borderRadius: '32px',
              border: '1px solid #232323',
              padding: 'var(--spacing-space-2x-large)',
            }}
          >
            <SelfManagedVaultsBox2Background />
            <Text variant="h4">One integration for all of crypto&apos;s onchain yield</Text>
            <Text
              variant="p1"
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-space-large)',
              }}
            >
              DAO risk managed vaults from Lazy Summer keeps your capital continuously allocated to
              DeFi’s highest performing strategies.
            </Text>
            <div className={selfManagedVaultsStyles.infoGridItem}>
              <div className={selfManagedVaultsStyles.infoGridBullet} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="p2" className={selfManagedVaultsStyles.infoGridTitle}>
                  Summer.fi
                </Text>
              </div>
            </div>
            <div className={selfManagedVaultsStyles.infoGridItem}>
              <div className={selfManagedVaultsStyles.infoGridBullet} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="p2" className={selfManagedVaultsStyles.infoGridTitle}>
                  Wisdom tree
                </Text>
              </div>
            </div>
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection
        className={`${selfManagedVaultsStyles.subLandingPageSection} ${selfManagedVaultsStyles.cardSection}`}
      >
        <div className={selfManagedVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            loading="eager"
            className={selfManagedVaultsStyles.linesBackground}
          />
          <div className={selfManagedVaultsStyles.backgroundOrb} />
          <div className={selfManagedVaultsStyles.cardContent}>
            <div className={selfManagedVaultsStyles.iconBadge}>
              <Icon iconName="chart" size={18} className={selfManagedVaultsStyles.icon} />
            </div>
            <Text variant="h4">Institutional-grade automation, whatever your structure</Text>
            <Text
              variant="p2"
              className={`${selfManagedVaultsStyles.subSectionTextSecondary} ${selfManagedVaultsStyles.cardSubtitle}`}
            >
              DAO Managed vaults adhere to a risk framework developed in partnership with Block
              Analitica.
            </Text>
            <div className={selfManagedVaultsStyles.iconGrid}>
              <CheckLine
                text={
                  <>
                    Purpose built risk{' '}
                    <span style={{ color: 'var(--color-text-link)', fontWeight: 'bold' }}>
                      framework
                    </span>{' '}
                    automatically screens protocols that take existential risks for yield.
                  </>
                }
              />
              <CheckLine text="Streamlined framework designed to categorize DeFi yields based on multiple factors." />
              <CheckLine text="Risk framework was developed in partnership with Block Analitica, the independent risk manager that actively oversee’s a set of vaults for the Lazy Summer protocol." />
            </div>
          </div>
        </div>
        <div className={selfManagedVaultsStyles.card}>
          <Image
            alt="background lines"
            src={ourProductsLinesBackground}
            className={`${selfManagedVaultsStyles.linesBackground} ${selfManagedVaultsStyles.linesBackgroundSecondBlock}`}
          />
          <div className={selfManagedVaultsStyles.backgroundOrb} />
          <div className={selfManagedVaultsStyles.cardContent}>
            <div className={selfManagedVaultsStyles.iconBadge}>
              <Icon iconName="shield_check" size={18} className={selfManagedVaultsStyles.icon} />
            </div>
            <Text variant="h4">Transparent flows & on demand risk oversight</Text>
            <Text
              variant="p2"
              className={`${selfManagedVaultsStyles.subSectionTextSecondary} ${selfManagedVaultsStyles.cardSubtitle}`}
            >
              DAO risk managed vaults optimize earning yields from DeFi’s best performing
              strategies, so that you always capture earnings from DeFi’s best available
              opportunities.
            </Text>
            <CheckLine text="Automated rebalancing to DeFi’s best performing yield strategies." />
            <CheckLine text="Machines make sure that your capital gets their before any one else to earn first." />
            <CheckLine text="No manual management whatsoever." />
          </div>
        </div>
      </SubLandingPageSection>
      <SubLandingPageSection>
        <Audits
          fullWidth
          noHeader
          chainSecurityLogo={chainSecurityLogo}
          prototechLabsLogo={prototechLabsLogo}
          sherlockLogo={sherlockLogo}
          onAuditClick={handleAuditClick}
        />
      </SubLandingPageSection>
    </>
  )
}
