import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { type EarnAppConfigType } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { NavigationItems } from '@/components/layout/Navigation/NavigationItems'
import { INTERNAL_LINKS } from '@/helpers/application-links.ts'

import navigationMenuMobileStyles from '@/components/layout/Navigation/NavigationMenuMobile.module.css'

type NavigationMobileMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
  toggleMobileMenu: () => void
  logo: string
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
  secondaryWalletConnectionComponent?: ReactNode
  featuresConfig?: EarnAppConfigType['features']
}

export const NavigationMenuMobile = ({
  links,
  currentPath,
  toggleMobileMenu,
  logo,
  signUpComponent,
  walletConnectionComponent,
  secondaryWalletConnectionComponent,
  featuresConfig,
}: NavigationMobileMenuType): React.ReactNode => {
  const beachClubEnabled = !!featuresConfig?.BeachClub

  return (
    <>
      <div className={navigationMenuMobileStyles.topBar}>
        <img src={logo} alt="Summer.fi" className={navigationMenuMobileStyles.logoSmall} />
        <div className={navigationMenuMobileStyles.actionsWrapper}>
          {signUpComponent}
          {secondaryWalletConnectionComponent}
          <Button
            variant="secondarySmall"
            onClick={toggleMobileMenu}
            className={navigationMenuMobileStyles.gradientOuterCircle}
          >
            <div className={navigationMenuMobileStyles.gradientInnerCircle} />
            <Icon iconName="close" size={11} color="var(--earn-protocol-secondary-70)" />
          </Button>
        </div>
      </div>
      <div className={navigationMenuMobileStyles.spacer} />
      <div className={navigationMenuMobileStyles.linksListWrapper}>
        <div className={navigationMenuMobileStyles.linksList}>
          {beachClubEnabled && (
            <Link href={INTERNAL_LINKS.beachClub} target="_blank">
              <Button
                variant="textSecondaryLarge"
                disabled={false}
                style={{
                  padding: `0.25em 0.375em 0.25em 0px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--general-space-4)',
                }}
              >
                Beach club <Icon iconName="beach_club_icon" size={24} />
              </Button>
            </Link>
          )}
          <Link href={INTERNAL_LINKS.summerPro} target="_blank">
            <Button
              variant="textSecondaryLarge"
              disabled={false}
              style={{ padding: `0.25em 0.375em 0.25em 0px` }}
              className={clsx({
                [navigationMenuMobileStyles.activeLink]: currentPath === INTERNAL_LINKS.summerPro,
              })}
            >
              Summer.fi Pro
            </Button>
          </Link>
          {links?.map((link) =>
            link.link ? (
              <Link
                key={`Mobile_${link.id}`}
                href={link.disabled ? '' : link.link ?? '/'}
                className={clsx({
                  [navigationMenuMobileStyles.activeLink]: currentPath === link.link,
                })}
                prefetch={Boolean(link.disabled)}
              >
                <Button
                  variant="textSecondaryLarge"
                  disabled={link.disabled}
                  style={{ padding: `0.25em 0.375em 0.25em 0px` }}
                >
                  {link.label}
                </Button>
              </Link>
            ) : (
              <Fragment key={`Mobile_${link.id}`}>
                <Expander
                  expanderWrapperStyles={{ padding: 0 }}
                  title={
                    <Text
                      as="p"
                      variant="p2semi"
                      style={{
                        opacity: link.disabled ? '0.5' : '1',
                      }}
                    >
                      {link.label}
                    </Text>
                  }
                  expanderButtonStyles={{
                    justifyContent: 'flex-start',
                    color: 'var(--earn-protocol-secondary-40)',
                    paddingLeft: 0,
                  }}
                  iconVariant="xxs"
                  disabled={link.disabled}
                >
                  <div style={{ padding: 0 }}>
                    {link.itemsList && (
                      <NavigationItems currentPath={currentPath} items={link.itemsList} />
                    )}
                    {link.dropdownContent}
                  </div>
                </Expander>
              </Fragment>
            ),
          )}
        </div>
        <div
          onClick={toggleMobileMenu}
          className={navigationMenuMobileStyles.walletConnectionComponent}
        >
          {walletConnectionComponent}
        </div>
      </div>
    </>
  )
}
