import { FC, PropsWithChildren } from 'react'
import { Footer, Navigation } from '@summerfi/app-ui'
import Image from 'next/image'

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
      <Navigation logo="img/branding/logo-dark.svg" logoSmall="img/branding/dot-dark.svg" />
      <div className={classNames.appContainer}>
        {children}
        <pre>
          {
            // eslint-disable-next-line no-magic-numbers
            JSON.stringify(systemConfig, null, 2)
          }
        </pre>
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
