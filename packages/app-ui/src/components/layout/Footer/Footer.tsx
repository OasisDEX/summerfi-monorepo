'use client'

import { type FC, type ReactNode } from 'react'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandTwitterFilled,
} from '@tabler/icons-react'
import Link from 'next/link'

import { ProxyLinkComponent } from '@/components/atoms/ProxyLinkComponent/ProxyLinkComponent'
import { Text } from '@/components/atoms/Text/Text'
import { EXTERNAL_LINKS, INTERNAL_LINKS } from '@/helpers/application-links'

import footerStyles from '@/components/layout/Footer/Footer.module.css'

export interface FooterProps {
  logo: string
  languageSwitcher?: ReactNode
  newsletter: ReactNode
}

const linksList = [
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
]

export const Footer: FC<FooterProps> = ({ logo, newsletter, languageSwitcher }) => {
  return (
    <div className={footerStyles.container}>
      <div>
        <img src={logo} alt="Summer.fi" className={footerStyles.logo} />
        <ul className={footerStyles.socialsList}>
          <li>
            <Link href="https://twitter.com/summerfinance_" target="_blank" rel="noreferrer">
              <IconBrandTwitterFilled size={20} />
            </Link>
          </li>
          <li>
            <Link href="https://discord.com/invite/summerfi" target="_blank" rel="noreferrer">
              <IconBrandDiscordFilled size={20} />
            </Link>
          </li>
          <li>
            <Link href="https://github.com/OasisDEX" target="_blank" rel="noreferrer">
              <IconBrandGithubFilled size={20} />
            </Link>
          </li>
        </ul>
        {languageSwitcher}
      </div>
      {linksList.map(({ links, title }, i) => (
        <div key={i}>
          <Text as="h3" variant="p1semi">
            {title}
          </Text>
          <ul className={footerStyles.linksList}>
            {links.map(({ label, url }, j) => (
              <li key={j}>
                <Link passHref legacyBehavior prefetch={false} href={url}>
                  <ProxyLinkComponent
                    {...(url.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                  >
                    <Text variant="p2">{label}</Text>
                  </ProxyLinkComponent>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {newsletter}
    </div>
  )
}
