import { type FC, type PropsWithChildren } from 'react'
import { Footer } from '@summerfi/app-ui'
import { parseServerResponse } from '@summerfi/serverless-shared'
import Image from 'next/image'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'
import { AccountChangeHandler } from '@/components/organisms/AccountChangeHandler/AccountChangeHandler'
import systemConfigHandler, { type SystemConfig } from '@/server-handlers/system-config'

import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({ children }) => {
  const systemConfig = parseServerResponse<SystemConfig>(await systemConfigHandler())

  return (
    <>
      <WalletInit />
      <div className={masterPageStyles.mainContainer}>
        <Image
          src="/img/backgrounds/bg-simple.svg"
          className={masterPageStyles.backgroundSimple}
          width={0}
          height={0}
          style={{ height: 'auto', width: '100%' }}
          alt=""
        />
        <NavigationWrapper panels={systemConfig.navigation} />
        <div className={masterPageStyles.appContainer}>
          {children}
          <Footer
            logo="img/branding/logo-dark.svg"
            languageSwitcher={<div />}
            newsletter={{
              button: 'Subscribe →',
              description: 'Subscribe to the newsletter for updates',
              label: 'Temporarily disabled',
              title: 'Stay up to date with Summer.fi',
            }}
          />
        </div>
      </div>
      <AccountChangeHandler />
    </>
  )
}
