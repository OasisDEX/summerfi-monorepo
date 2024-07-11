import { type FC, type PropsWithChildren } from 'react'
import { Footer } from '@summerfi/app-ui'
import Image from 'next/image'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'
import { AccountChangeHandler } from '@/components/organisms/AccountChangeHandler/AccountChangeHandler'
import { parseServerResponse } from '@/helpers/parse-server-response'
import systemConfigHandler from '@/server-handlers/system-config'

import classNames from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({ children }) => {
  const systemConfig = parseServerResponse<Awaited<ReturnType<typeof systemConfigHandler>>>(
    await systemConfigHandler(),
  )

  return (
    <>
      <WalletInit />
      <div className={classNames.mainContainer}>
        <Image
          src="/img/backgrounds/bg-simple.svg"
          className={classNames.backgroundSimple}
          width={0}
          height={0}
          style={{ height: 'auto', width: '100%' }}
          alt=""
        />
        <NavigationWrapper panels={systemConfig.navigation} />
        <div className={classNames.appContainer}>
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
