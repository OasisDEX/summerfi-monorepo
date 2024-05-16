import { FC, PropsWithChildren } from 'react'
import { Footer } from '@summerfi/app-ui'
import Image from 'next/image'

import classNames from './MasterPage.module.scss'

interface MasterPageProps {
  // more to be implemented in the future
  background?: 'simple'
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  background = 'simple',
  children,
}) => {
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
      <div className={classNames.appContainer}>
        {children}
        <Footer
          logo="img/branding/logo-dark.svg"
          lists={[
            {
              title: 'About',
              links: [
                {
                  label: 'Team',
                  url: '/',
                },
                {
                  label: 'Contact',
                  url: '/',
                },
                {
                  label: 'Careers',
                  url: '/',
                },
                {
                  label: 'Privacy',
                  url: '/',
                },
                {
                  label: 'Cookie Policy',
                  url: '/',
                },
                {
                  label: 'Terms',
                  url: '/',
                },
                {
                  label: 'Security',
                  url: '/',
                },
              ],
            },
            {
              title: 'Resources',
              links: [
                {
                  label: 'Blog',
                  url: '/',
                },
                {
                  label: 'Knowledge base',
                  url: '/',
                },
                {
                  label: 'Bug bounty',
                  url: '/',
                },
                {
                  label: 'Ajna rewards',
                  url: '/',
                },
                {
                  label: 'Referrals',
                  url: '/',
                },
                {
                  label: 'Brand assets',
                  url: '/',
                },
              ],
            },
            {
              title: 'Products',
              links: [
                {
                  label: 'Borrow',
                  url: '/',
                },
                {
                  label: 'Multiply',
                  url: '/',
                },
                {
                  label: 'Earn',
                  url: '/',
                },
              ],
            },
          ]}
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
