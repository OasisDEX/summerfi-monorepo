import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { NavigationItems } from '@/components/layout/Navigation/NavigationItems'
import { INTERNAL_LINKS } from '@/helpers/application-links.ts'

import navigationMenuMobileStyles from '@/components/layout/Navigation/NavigationMenuMobile.module.scss'

type NavigationMobileMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
  toggleMobileMenu: () => void
  logo: string
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
}

export const NavigationMenuMobile = ({
  links,
  currentPath,
  toggleMobileMenu,
  logo,
  signUpComponent,
  walletConnectionComponent,
}: NavigationMobileMenuType) => {
  return (
    <>
      <div className={navigationMenuMobileStyles.topBar}>
        <img src={logo} alt="Summer.fi" className={navigationMenuMobileStyles.logoSmall} />
        <Button
          variant="secondarySmall"
          onClick={toggleMobileMenu}
          className={navigationMenuMobileStyles.gradientOuterCircle}
        >
          <div className={navigationMenuMobileStyles.gradientInnerCircle} />
          <Icon iconName="close" size={11} color="var(--earn-protocol-secondary-70)" />
        </Button>
      </div>
      <div className={navigationMenuMobileStyles.linksListWrapper}>
        <div className={navigationMenuMobileStyles.linksList}>
          <Link href={INTERNAL_LINKS.summerPro} target="_blank">
            <Text
              as="p"
              variant="p2semi"
              className={clsx({
                [navigationMenuMobileStyles.activeLink]: currentPath === INTERNAL_LINKS.summerPro,
              })}
            >
              Summer.fi Pro
            </Text>
          </Link>
          {links?.map((link) =>
            link.link ? (
              <Link
                key={`Mobile_${link.id}`}
                href={link.link}
                className={clsx({
                  [navigationMenuMobileStyles.activeLink]: currentPath === link.link,
                })}
              >
                <Text as="p" variant="p2semi">
                  {link.label}
                </Text>
              </Link>
            ) : (
              <Fragment key={`Mobile_${link.id}`}>
                <Expander
                  title={
                    <Text as="p" variant="p2semi">
                      {link.label}
                    </Text>
                  }
                  expanderButtonStyles={{
                    justifyContent: 'flex-start',
                    color: 'var(--earn-protocol-secondary-40)',
                  }}
                >
                  <div style={{ padding: 'var(--general-space-8)' }}>
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
      </div>
      {signUpComponent}
      <div onClick={toggleMobileMenu} className={navigationMenuMobileStyles.buttonWrapper}>
        {walletConnectionComponent}
      </div>
    </>
  )
}
