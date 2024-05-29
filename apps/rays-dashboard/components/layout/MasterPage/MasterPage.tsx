import { FC, PropsWithChildren } from 'react'
import { Footer } from '@summerfi/app-ui'
import Image from 'next/image'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
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
  const systemConfig = await systemConfigHandler()

  return (
    <div className={classNames.mainContainer}>
      {
        {
          simple: (
            <Image
              src="/img/backgrounds/bg-simple.svg"
              width={1700}
              height={611}
              className={classNames.backgroundSimple}
              alt=""
            />
          ),
        }[background]
      }
      <NavigationWrapper panels={systemConfig.navigation} />
      <div className={classNames.appContainer}>
        {children}
        <Footer
          logo="img/branding/logo-dark.svg"
          languageSwitcher={
            <div className={classNames.languageSwitcher}>
              <button>EN</button>
              <button>US</button>
            </div>
          }
          newsletter={{
            button: 'Subscribe →',
            description: 'Subscribe to the newsletter for updates',
            label: 'Temporarily disabled',
            title: 'Stay up to date with Summer.fi',
          }}
        />
      </div>
    </div>
  )
}
