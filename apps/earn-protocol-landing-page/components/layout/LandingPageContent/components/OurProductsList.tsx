import { useEffect, useState } from 'react'
import { AnimateHeight, Icon, Text } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/dist/client/link'
import Image from 'next/image'

import { TagButton } from '@/components/atoms/TagButton'
import { CheckLine } from '@/components/layout/LandingPageContent/components/CheckLine'
import { ProtocolIconsWithMore } from '@/components/molecules/ProtocolIconsWithMore/ProtocolIconsWithMore'
import blockAnalyticaLogo from '@/public/img/landing-page/block-analytica.svg'
import balanceMarketLogo from '@/public/img/landing-page/private-markets/logo_balance.svg'
import cryptoFinanceMarketLogo from '@/public/img/landing-page/private-markets/logo_crypto_finance.svg'
import utilaMarketLogo from '@/public/img/landing-page/private-markets/logo_utila.svg'
import m1CapitalLogo from '@/public/img/landing-page/private-markets/m1_capital.svg'

import styles from '@/components/layout/LandingPageContent/components/OurProductsList.module.css'

import integrateWithBalance from '@/public/img/landing-page/integrate-via/balance.png'
import integrateWithDefiSaver from '@/public/img/landing-page/integrate-via/defi_saver.png'
import integrateViaEnso from '@/public/img/landing-page/integrate-via/enso.png'
import integrateViaSummer from '@/public/img/landing-page/integrate-via/summer.png'
import integrateWithTargen from '@/public/img/landing-page/integrate-via/targen.png'
import integrateWithUtila from '@/public/img/landing-page/integrate-via/utila.png'
import integrateWithVaultsFyi from '@/public/img/landing-page/integrate-via/vault_fyi.png'
import integrateViaYieldXyz from '@/public/img/landing-page/integrate-via/yield_xyz.png'
import ourProductsGridBackground from '@/public/img/landing-page/our-products-grid-bg.png'
import ourProductsLinesBackground from '@/public/img/landing-page/our-products-lines-bg.png'
import franklinTempletonMarketLogo from '@/public/img/landing-page/private-markets/franklin_templeton.png'
import mapleMarketLogo from '@/public/img/landing-page/private-markets/maple.png'
import securitizeMarketLogo from '@/public/img/landing-page/private-markets/securitize.png'
// import stacMarketLogo from '@/public/img/landing-page/private-markets/stac.png'
import superstateMarketLogo from '@/public/img/landing-page/private-markets/superstate.png'
// import wisdomTreeMarketLogo from '@/public/img/landing-page/private-markets/wisdomtree.png'
import sdkScreenshot from '@/public/img/landing-page/sdk-screenshot.png'
import vaultExposureScreenshot from '@/public/img/landing-page/vault-exposure-screenshot.png'

const PermissionlessDeFiVaultsCard = ({ maxApyRegularVault }: { maxApyRegularVault: number }) => {
  return (
    <Link href="/permissionless-vaults">
      <article className={`${styles.productCard}`}>
        <Image
          alt="background lines"
          src={ourProductsLinesBackground}
          loading="eager"
          style={{
            width: 'auto',
            height: 'auto',
          }}
          className={styles.ourProductsLinesBackground}
        />
        <div className={styles.permissionlessDefiVaultsBackgroundOrb} />
        <div className={styles.cardContent}>
          <div className={styles.cardMain}>
            <div>
              <Text as="p" variant="p3colorful">
                Permissionless DeFi Vaults
              </Text>
              <Text as="h3" variant="h4" className={styles.cardTitle}>
                Get automated exposure to DeFi&apos;s highest quality yield
              </Text>
              <Text as="p" variant="p2" className={styles.cardBody}>
                Outperform with automated access to DeFi&apos;s best yield sources
              </Text>
            </div>
            <div className={styles.checksGroup}>
              <CheckLine text="Risk Managed vaults: Higher risk adjusted yields managed by Block Analitica" />
              <CheckLine text="DAO Managed vaults: DeFi's best yields optimized for higher risk/reward yields" />
            </div>
            <div className={styles.metaBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Markets and strategies including
              </Text>
              <ProtocolIconsWithMore />
            </div>
            <button className={styles.learnMoreButton} type="button">
              <Text as="span" variant="p3">
                Learn more
              </Text>
            </button>
          </div>
          <aside className={styles.cardSide}>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Earn up to
              </Text>
              <Text as="p" variant="h2" className={styles.apyValue}>
                {formatDecimalAsPercent(maxApyRegularVault, {
                  precision: 2,
                })}
              </Text>
            </div>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Available assets
              </Text>
              <div className={styles.assetIcons}>
                <div className={styles.assetIcon}>
                  <Icon tokenName="USDC" size={40} />
                </div>
                <div className={styles.assetIcon}>
                  <Icon tokenName="ETH" size={40} />
                </div>
                <div className={styles.assetIcon}>
                  <Icon tokenName="USDT" size={40} />
                </div>
                <div className={styles.assetIcon}>
                  <Icon tokenName="EURC" size={40} />
                </div>
              </div>
            </div>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Risk managed by
              </Text>
              <Image
                alt="Block Analitica"
                src={blockAnalyticaLogo}
                width={110}
                height={45}
                style={{
                  marginTop: '16px',
                  width: 'auto',
                  height: '45px',
                }}
              />
            </div>
          </aside>
        </div>
      </article>
    </Link>
  )
}

const PermissionlessRwaVaultsCard = () => {
  return (
    <Link href="/rwa-vaults">
      <article className={`${styles.productCard} ${styles.rwaCard}`}>
        <div className={styles.permissionlessRwaVaultsBackgroundOrb} />
        <div className={styles.cardContent}>
          <div className={styles.cardMain}>
            <div>
              <Text as="p" variant="p3colorful">
                Permissioned RWA Vaults
              </Text>
              <Text as="h3" variant="h4" className={styles.cardTitle}>
                Instant access to a basket of RWA private markets in a single Vault
              </Text>
              <Text as="p" variant="p2" className={styles.cardBody}>
                Purpose built Vaults designed for Institutions, HNW’s, Hedge Funds and Custodians to
                earn from the best RWA markets without the hassle.
              </Text>
            </div>
            <div className={styles.checksGroup}>
              <CheckLine text="Deposits only ever allocated to permissioned markets" />
              <CheckLine text="Actively managed and rebalanced by M1-Capital" />
              <CheckLine text="Coming soon via Utilia, Balance Custody and Summer.fi (KYC required)" />
            </div>
            <div className={styles.metaBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Markets and strategies including
              </Text>
              <div
                className={styles.partnerLogos}
                style={{
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                }}
              >
                <Image
                  alt="Securitize"
                  src={securitizeMarketLogo}
                  width={180}
                  height={54}
                  className={styles.partnerLogo}
                />
                <Image
                  alt="Franklin Templeton"
                  src={franklinTempletonMarketLogo}
                  width={180}
                  height={54}
                  className={styles.partnerLogo}
                />
                <Image
                  alt="Maple"
                  src={mapleMarketLogo}
                  width={180}
                  height={54}
                  className={styles.partnerLogo}
                />
                <Image
                  alt="Superstate"
                  src={superstateMarketLogo}
                  width={261}
                  height={54}
                  className={styles.partnerLogo}
                />
                {/* <Image
                  alt="WisdomTree"
                  src={wisdomTreeMarketLogo}
                  width={172}
                  height={54}
                  className={styles.partnerLogo}
                /> */}
                {/* <Image
                alt="Stac"
                src={stacMarketLogo}
                width={140}
                height={54}
                className={styles.partnerLogo}
              /> */}
              </div>
            </div>
            <button className={styles.learnMoreButton} type="button">
              <Text as="span" variant="p3">
                Learn more
              </Text>
            </button>
          </div>
          <aside className={styles.cardSide}>
            <div className={styles.sideStatBlock}>
              {/* <Text as="p" variant="p4semi" className={styles.metaLabel}>
              Earn up to
            </Text> */}
              <TagButton>Coming soon</TagButton>
              {/* <Text as="p" variant="h2" className={styles.apyValue}>
              8.5%
            </Text> */}
            </div>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Available on
              </Text>
              <div className={styles.verticalLogos}>
                <Image
                  alt="Utila"
                  src={utilaMarketLogo}
                  width={98}
                  height={24}
                  className={styles.smallBrandLogo}
                />
                <Image
                  alt="Balance"
                  src={balanceMarketLogo}
                  width={137}
                  height={27}
                  className={styles.smallBrandLogo}
                />
                <Image
                  alt="Crypto Finance"
                  src={cryptoFinanceMarketLogo}
                  width={137}
                  height={27}
                  className={styles.smallBrandLogo}
                />
                <Text as="p" variant="p4semi" className={styles.metaLabel}>
                  (More coming soon)
                </Text>
              </div>
            </div>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Managed by
              </Text>
              <Image
                alt="M1 Capital"
                src={m1CapitalLogo}
                width={302}
                height={54}
                className={styles.m1Logo}
              />
            </div>
          </aside>
        </div>
      </article>
    </Link>
  )
}

const BuildYourOwnVaultCard = () => {
  return (
    <Link href="/self-managed-vaults">
      <article className={`${styles.productCard} ${styles.buildCard}`}>
        <Image
          alt="background grid"
          src={ourProductsGridBackground}
          style={{
            width: 'auto',
            height: 'auto',
          }}
          className={styles.ourProductsGridBackground}
        />
        <div className={styles.cardContent}>
          <div className={styles.cardMain}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '540px',
                gap: '12px',
              }}
            >
              <Text as="p" variant="p3colorful">
                Build your own DeFi Vault
              </Text>
              <Text as="h3" variant="h4" className={styles.cardTitle}>
                Institutional Vault infrastructure to design your own DeFi and RWA Vaults
              </Text>
              <Text as="p" variant="p2" className={styles.cardBody}>
                Self-Managed Vaults enable unlimited access to DeFi and RWA yield for institutions
                who want to build custom Vaults with minimal overhead.
              </Text>
            </div>
            <div
              className={styles.checksGroup}
              style={{
                maxWidth: '540px',
              }}
            >
              <CheckLine text="Access any onchain market, permissioned or permissionless" />
              <CheckLine text="Create a new revenue stream for your business" />
              <CheckLine text="Choose from off-the-shelf automated keepers for optimization or run your own" />
              <CheckLine text="One deployment, unlimited possibilities with all upgrades and new market development handled by Summer.fi" />
            </div>
            <div className={styles.metaBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Choose from any market or protocol including
              </Text>
              <ProtocolIconsWithMore />
            </div>
            <button className={styles.learnMoreButton} type="button">
              <Text as="span" variant="p3">
                Learn more
              </Text>
            </button>
          </div>
          <aside className={styles.cardSide}>
            <div className={styles.sideStatBlock}>
              <Text as="p" variant="p4semi" className={styles.metaLabel}>
                Opt in risk management from
              </Text>
              <Image
                alt="Block Analitica"
                src={blockAnalyticaLogo}
                width={110}
                height={45}
                style={{
                  marginTop: '16px',
                  width: 'auto',
                  height: '45px',
                }}
              />
            </div>
            <div className={styles.vaultExposureScreenshotWrapper}>
              <Image src={vaultExposureScreenshot} alt="vault exposure screenshot" />
            </div>
          </aside>
        </div>
      </article>
    </Link>
  )
}

const IntegrateViaCarousel = () => {
  const integrateViaCarouselElements = [
    {
      key: 'defi-saver',
      element: (
        <Image
          alt="DeFi Saver"
          src={integrateWithDefiSaver}
          width={162}
          height={39}
          className={styles.stackLogo}
        />
      ),
    },
    {
      key: 'balance',
      element: (
        <Image
          alt="Balance"
          src={integrateWithBalance}
          width={149}
          height={29}
          className={styles.stackLogo}
        />
      ),
    },
    {
      key: 'vaults-fyi',
      element: (
        <Image
          alt="Vaults.fyi"
          src={integrateWithVaultsFyi}
          width={141}
          height={37}
          className={styles.stackLogo}
        />
      ),
    },
    {
      key: 'utila',
      element: (
        <Image
          alt="Utila"
          src={integrateWithUtila}
          width={117}
          height={29}
          className={styles.stackLogo}
        />
      ),
    },
    {
      key: 'targen',
      element: (
        <Image
          alt="Targen"
          src={integrateWithTargen}
          width={136}
          height={25}
          className={styles.stackLogo}
        />
      ),
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % integrateViaCarouselElements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [integrateViaCarouselElements.length])

  return (
    <div className={styles.carouselContainer}>
      {integrateViaCarouselElements.map((element, index) => (
        <div
          key={element.key}
          className={clsx(styles.carouselItem, {
            [styles.carouselItemActive]: index === currentIndex,
            [styles.carouselItemFadeOut]:
              index ===
              (currentIndex - 1 + integrateViaCarouselElements.length) %
                integrateViaCarouselElements.length,
          })}
        >
          {element.element}
        </div>
      ))}
    </div>
  )
}

const IntegrateHighQualityYield = ({ maxApyRegularVault }: { maxApyRegularVault: number }) => {
  return (
    <Link href="/integrations">
      <article className={`${styles.productCard} ${styles.integratorCard}`}>
        <div className={styles.cardContent}>
          <div
            className={styles.cardMain}
            style={{
              maxWidth: '740px',
            }}
          >
            <div>
              <Text as="p" variant="p3colorful">
                Integrate high quality DeFi yield
              </Text>
              <Text as="h3" variant="h4" className={styles.cardTitle}>
                Give your users access to the best yields, effortlessly
              </Text>
            </div>
            <div className={styles.checksGroup}>
              <CheckLine
                text={`Offer yield up to ${formatDecimalAsPercent(maxApyRegularVault, {
                  precision: 2,
                })} integrate via Summer.fi SDK, Yield.xyz or Enso Finance.`}
              />
              <CheckLine text="Join leading custodians and apps such as Utila, Balance Custody, DeFi Saver, Vaults.fyi and more offering the highest quality yield." />
              <CheckLine text="Earn revenue share on all integrated vaults (DeFi and RWA)" />
              <CheckLine text="The Vaults update, meaning you don’t have to - one integration gives unlimited access for your users.  " />
            </div>
            <div className={styles.integratorMetaGrid}>
              <div>
                <Text as="p" variant="p4semi" className={styles.metaLabel}>
                  Earn up to
                </Text>
                <Text as="p" variant="h2" className={styles.apyValue}>
                  20bps
                </Text>
              </div>
              <div>
                <Text as="p" variant="p4semi" className={styles.metaLabel}>
                  Integrate via
                </Text>
                <div className={styles.partnerLogos}>
                  <Image
                    alt="Summer.fi"
                    src={integrateViaSummer}
                    width={233}
                    height={70}
                    className={styles.partnerLogo}
                  />
                  <Image
                    alt="Yield.xyz"
                    src={integrateViaYieldXyz}
                    width={203}
                    height={54}
                    className={styles.partnerLogo}
                  />
                  <Image
                    alt="Enso"
                    src={integrateViaEnso}
                    width={232}
                    height={54}
                    className={styles.partnerLogo}
                  />
                </div>
              </div>
            </div>
            <button className={styles.learnMoreButton} type="button">
              <Text as="span" variant="p3">
                Learn more
              </Text>
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <aside className={styles.cardSide}>
              <div className={styles.sdkScreenshotWrapper}>
                <Image src={sdkScreenshot} alt="SDK screenshot" />
              </div>
              <div className={styles.integrateViaAnimationWrapper}>
                <Text
                  variant="p3"
                  style={{
                    color: '#64545C',
                  }}
                >
                  Join others who have integrated such as:
                </Text>
                <IntegrateViaCarousel />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </Link>
  )
}

export const OurProductsList = ({
  ourProductsStats,
  activeTab,
}: {
  ourProductsStats: { maxApyRegularVault: number }
  activeTab: string
}) => {
  const [localActiveTab, setLocalActiveTab] = useState<string | null>(activeTab)

  useEffect(() => {
    if (activeTab !== localActiveTab && localActiveTab !== null) {
      setLocalActiveTab(null)
      setTimeout(() => {
        setLocalActiveTab(activeTab)
      }, 500)
    }
  }, [activeTab, localActiveTab])
  const showAllProducts = localActiveTab === 'all-products'
  const showPermissionlessDefiVaults =
    showAllProducts || localActiveTab === 'permissionless-defi-vaults'
  const showPermissionedRwaVaults = showAllProducts || localActiveTab === 'permissioned-rwa-vaults'
  const showBuildYourOwnVault = showAllProducts || localActiveTab === 'build-your-own-defi-vault'
  const showIntegrateHighQualityYield =
    showAllProducts || localActiveTab === 'integrate-high-quality-defi-yield'

  return (
    <div className={clsx(styles.cardsList, localActiveTab === null && styles.empty)}>
      <AnimateHeight id="permissionless-defi-vaults" show={showPermissionlessDefiVaults}>
        <PermissionlessDeFiVaultsCard maxApyRegularVault={ourProductsStats.maxApyRegularVault} />
      </AnimateHeight>
      <AnimateHeight id="permissioned-rwa-vaults" show={showPermissionedRwaVaults}>
        <PermissionlessRwaVaultsCard />
      </AnimateHeight>
      <AnimateHeight id="build-your-own-defi-vault" show={showBuildYourOwnVault}>
        <BuildYourOwnVaultCard />
      </AnimateHeight>
      <AnimateHeight id="integrate-high-quality-defi-yield" show={showIntegrateHighQualityYield}>
        <IntegrateHighQualityYield maxApyRegularVault={ourProductsStats.maxApyRegularVault} />
      </AnimateHeight>
    </div>
  )
}
