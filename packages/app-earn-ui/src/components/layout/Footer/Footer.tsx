'use client'

import { type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { EXTERNAL_LINKS, INTERNAL_LINKS } from '@/helpers/application-links'

import footerStyles from '@/components/layout/Footer/Footer.module.scss'

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
]

export const Footer: FC<FooterProps> = ({ logo, newsletter, languageSwitcher }) => {
  return (
    <div className={footerStyles.container}>
      <div>
        <img src={logo} alt="Summer.fi" className={footerStyles.logo} />
        <ul className={footerStyles.socialsList}>
          <li>
            <Link href="https://twitter.com/summerfinance_" target="_blank" rel="noreferrer">
              <Icon
                iconName="brand_icon_twitter"
                size={20}
                color="var(--color-background-primary)"
              />
            </Link>
          </li>
          <li>
            <Link href="https://discord.com/invite/summerfi" target="_blank" rel="noreferrer">
              <Icon
                iconName="brand_icon_discord"
                size={20}
                color="var(--color-background-primary)"
              />
            </Link>
          </li>
          <li>
            <Link href="https://github.com/OasisDEX" target="_blank" rel="noreferrer">
              <Icon
                iconName="brand_icon_github"
                size={20}
                color="var(--color-background-primary)"
              />
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
                <Link prefetch={false} href={url}>
                  <Text variant="p2">{label}</Text>
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
