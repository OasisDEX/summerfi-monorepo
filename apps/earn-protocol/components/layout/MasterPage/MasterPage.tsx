import { type FC, type PropsWithChildren } from 'react'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'

import './global.css'
import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({ children }) => {
  return (
    <>
      <WalletInit />
      <div className={masterPageStyles.mainContainer}>
        <NavigationWrapper />
        <div className={masterPageStyles.appContainer}>{children}</div>
        <div
          style={{
            display: 'flex',
            marginTop: '32px',
            marginBottom: '32px',
            justifyContent: 'center',
          }}
        >
          Footer
        </div>
      </div>
    </>
  )
}
