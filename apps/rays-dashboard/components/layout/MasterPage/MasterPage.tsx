import { FC, PropsWithChildren } from 'react'
import { EXTERNAL_LINKS, Footer, INTERNAL_LINKS } from '@summerfi/app-ui'
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
                  url: INTERNAL_LINKS.about,
                },
                {
                  label: 'Contact',
                  url: EXTERNAL_LINKS.KB.CONTACT,
                },
                {
                  label: 'Careers',
                  url: EXTERNAL_LINKS.WORKABLE,
                },
                {
                  label: 'Privacy',
                  url: INTERNAL_LINKS.privacy,
                },
                {
                  label: 'Cookie Policy',
                  url: INTERNAL_LINKS.cookie,
                },
                {
                  label: 'Terms',
                  url: INTERNAL_LINKS.terms,
                },
                {
                  label: 'Security',
                  url: INTERNAL_LINKS.security,
                },
              ],
            },
            {
              title: 'Resources',
              links: [
                {
                  label: 'Blog',
                  url: EXTERNAL_LINKS.BLOG.MAIN,
                },
                {
                  label: 'Knowledge base',
                  url: EXTERNAL_LINKS.KB.HELP,
                },
                {
                  label: 'Bug bounty',
                  url: EXTERNAL_LINKS.BUG_BOUNTY,
                },
                {
                  label: 'Ajna rewards',
                  url: INTERNAL_LINKS.ajnaRewards,
                },
                {
                  label: 'Referrals',
                  url: INTERNAL_LINKS.referrals,
                },
                {
                  label: 'Brand assets',
                  url: INTERNAL_LINKS.brand,
                },
              ],
            },
            {
              title: 'Products',
              links: [
                {
                  label: 'Borrow',
                  url: INTERNAL_LINKS.borrow,
                },
                {
                  label: 'Multiply',
                  url: INTERNAL_LINKS.multiply,
                },
                {
                  label: 'Earn',
                  url: INTERNAL_LINKS.earn,
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
