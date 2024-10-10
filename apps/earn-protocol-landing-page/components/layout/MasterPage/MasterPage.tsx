import { type FC, type PropsWithChildren } from 'react'
import { MainBackground } from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'

import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({ children }) => {
  return (
    <div className={masterPageStyles.mainContainer}>
      <NavigationWrapper />
      <div className={masterPageStyles.appContainer}>
        {children}
        <div style={{ marginTop: '100px', textAlign: 'center' }}>Footer (:</div>
      </div>
      <MainBackground />
    </div>
  )
}
