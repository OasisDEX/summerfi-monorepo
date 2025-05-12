import { type FC, type PropsWithChildren } from 'react'
import { Footer } from '@summerfi/app-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import Image from 'next/image'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { WalletInit } from '@/components/molecules/WalletInit/WalletInit'
import { AccountChangeHandler } from '@/components/organisms/AccountChangeHandler/AccountChangeHandler'
import { NewsletterWrapper } from '@/components/organisms/NewsletterWrapper/NewsletterWrapper'
import { basePath } from '@/helpers/base-path'
import systemConfigHandler from '@/server-handlers/system-config'

import masterPageStyles from './MasterPage.module.css'

interface MasterPageProps {
  // more to be implemented in the future
  background?: 'simple'
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({
  background = 'simple',
  children,
}) => {
  const systemConfig = parseServerResponseToClient(await systemConfigHandler())

  return (
    <>
      <WalletInit />
      <div className={masterPageStyles.mainContainer}>
        {
          {
            simple: (
              <Image
                src={`${basePath}/img/backgrounds/bg-simple.svg`}
                className={masterPageStyles.backgroundSimple}
                height={0}
                width={0}
                style={{ height: 'auto', width: '100%' }}
                alt=""
              />
            ),
          }[background]
        }
        <NavigationWrapper panels={systemConfig.navigation} />

        <div className={masterPageStyles.appContainer}>
          {children}
          <Footer
            logo={`${basePath}/img/branding/logo-dark.svg`}
            languageSwitcher={<div />}
            newsletter={<NewsletterWrapper config={systemConfig.config} />}
          />
        </div>
      </div>
      <AccountChangeHandler />
    </>
  )
}
