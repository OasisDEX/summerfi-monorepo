import { type FC, type PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'

import './global.css'
import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

const SetForkModal = dynamic(() => import('@/components/organisms/SetFork/SetForkModal'), {
  ssr: false,
})

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
            alignItems: 'center',
            gap: '20px',
          }}
        >
          Footer <SetForkModal />
        </div>
      </div>
    </>
  )
}
