import { type FC, type PropsWithChildren } from 'react'
import { MainBackground } from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'

import landingMasterPageStyles from './landingMasterPage.module.scss'

interface LandingMasterPageProps {}

export const LandingMasterPage: FC<PropsWithChildren<LandingMasterPageProps>> = ({ children }) => {
  return (
    <div className={landingMasterPageStyles.mainContainer}>
      <NavigationWrapper />
      <div className={landingMasterPageStyles.appContainer}>
        {children}
        <div style={{ marginTop: '100px', textAlign: 'center' }}>Footer (:</div>
      </div>
      <MainBackground />
    </div>
  )
}
