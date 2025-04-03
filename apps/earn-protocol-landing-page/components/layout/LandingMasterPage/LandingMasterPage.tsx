'use client'

import { type PropsWithChildren, useEffect, useState } from 'react'
import { Footer, NewsletterWrapper, Text } from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.scss'

interface LandingMasterPageProps {}

export const LandingMasterPage: React.FC<PropsWithChildren<LandingMasterPageProps>> = ({
  children,
}) => {
  const [scrolledAmount, setScrolledAmount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolledAmount(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={landingMasterPageStyles.mainContainer}>
      <div className={landingMasterPageStyles.bubbles} style={{ top: `${scrolledAmount * 0.2}px` }}>
        <div className={landingMasterPageStyles.bubblesShadow} />
        <video
          width="100%"
          autoPlay
          loop
          muted
          playsInline
          className={landingMasterPageStyles.video}
        >
          <source src="/img/landing-page/bubbles.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={landingMasterPageStyles.appContainer}>
        <NavigationWrapper />
        {children}
        <Footer
          logo="/img/branding/logo-light.svg"
          newsletter={
            <div>
              <Text
                as="h3"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
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
                <NewsletterWrapper inputBtnLabel="Subscribe" />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
