import { type FC, type PropsWithChildren } from 'react'
import { Footer, MainBackground, NewsletterWrapper, Text } from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.scss'

interface LandingMasterPageProps {}

export const LandingMasterPage: FC<PropsWithChildren<LandingMasterPageProps>> = ({ children }) => {
  return (
    <div className={landingMasterPageStyles.mainContainer}>
      <NavigationWrapper />
      <div className={landingMasterPageStyles.appContainer}>
        {children}
        <Footer
          logo="/img/branding/logo-light.svg"
          newsletter={
            <div>
              <Text
                as="h3"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--general-space-16)',
                }}
              >
                Stay up to date
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-space-medium)',
                }}
              >
                Subscribe to the newsletter for Oasis updates
              </Text>
              <div
                style={{
                  maxWidth: '380px',
                }}
              >
                <NewsletterWrapper inputBtnLabel="Subscribe" />
              </div>
            </div>
          }
        />
      </div>
      <MainBackground />
    </div>
  )
}
