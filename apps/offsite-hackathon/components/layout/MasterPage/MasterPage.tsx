import { FC, PropsWithChildren } from 'react'
import { Footer, LaunchBanner } from '@summerfi/app-ui'
import Image from 'next/image'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'
import { AccountChangeHandler } from '@/components/organisms/AccountChangeHandler/AccountChangeHandler'
import { basePath } from '@/helpers/base-path'
import { parseServerResponse } from '@/helpers/parse-server-response'
import systemConfigHandler from '@/server-handlers/system-config'

import classNames from './MasterPage.module.scss'

interface MasterPageProps {
  // more to be implemented in the future
  background?: 'simple'
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({
  background = 'simple',
  children,
}) => {
  const systemConfig = parseServerResponse<Awaited<ReturnType<typeof systemConfigHandler>>>(
    await systemConfigHandler(),
  )

  return (
    <>
      <LaunchBanner />
      <WalletInit />
      <div className={classNames.mainContainer}>
        {
          {
            simple: (
              <Image
                src={`${basePath}/img/backgrounds/bg-simple.svg`}
                className={classNames.backgroundSimple}
                width={0}
                height={0}
                style={{ height: 'auto', width: '100%' }}
                alt=""
              />
            ),
          }[background]
        }
        <NavigationWrapper panels={systemConfig.navigation} />
        <div className={classNames.appContainer}>
          {children}
          <Footer
            logo={`${basePath}/img/branding/logo-dark.svg`}
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
