import { type FC, type PropsWithChildren } from 'react'
import { Footer, NewsletterWrapper, Text } from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { isPreLaunchVersion } from '@/constants/is-pre-launch-version'

import './global.css'
import masterPageStyles from './MasterPage.module.scss'
import { OffsetLayout } from '../OffsetLayout/OffsetLayout'

interface MasterPageProps {
  skipNavigation?: boolean
  noNavMargin?: boolean
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  children,
  skipNavigation = false,
}) => {
  return (
    <div className={masterPageStyles.mainContainer}>
      {!skipNavigation && <NavigationWrapper isPreLaunchVersion={isPreLaunchVersion} />}
      <OffsetLayout>
        <div className={masterPageStyles.appContainer}>{children}</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '32px',
            marginBottom: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Footer
            logo="/earn/img/branding/logo-light.svg"
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
                  Subscribe to the newsletter for Summer.fi updates
                </Text>
                <div
                  style={{
                    maxWidth: '380px',
                  }}
                >
                  <NewsletterWrapper inputBtnLabel="Subscribe" isEarnApp />
                </div>
              </div>
            }
          />
        </div>
      </OffsetLayout>
    </div>
  )
}
