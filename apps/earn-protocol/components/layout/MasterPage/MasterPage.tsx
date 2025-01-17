import { type FC, type PropsWithChildren } from 'react'
import { Footer, NewsletterWrapper, Text } from '@summerfi/app-earn-ui'

// import dynamic from 'next/dynamic'
import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'

import './global.css'
import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

// const SetForkModal = dynamic(() => import('@/components/organisms/SetFork/SetForkModal'), {
//   ssr: false,
// })

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({ children }) => {
  return (
    <div className={masterPageStyles.mainContainer}>
      <NavigationWrapper />
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
        {/* <SetForkModal /> */}
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
    </div>
  )
}
