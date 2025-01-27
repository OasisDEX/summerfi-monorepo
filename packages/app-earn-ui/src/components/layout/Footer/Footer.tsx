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
        url: INTERNAL_LINKS.tempAbout,
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
        url: INTERNAL_LINKS.tempPrivacy,
      },
      {
        label: 'Cookie Policy',
        url: INTERNAL_LINKS.tempCookie,
      },
      {
        label: 'Terms',
        url: INTERNAL_LINKS.tempTerms,
      },
      {
        label: 'Security',
        url: INTERNAL_LINKS.tempSecurity,
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
        url: INTERNAL_LINKS.tempAjnaRewards,
      },
      {
        label: 'Referrals',
        url: INTERNAL_LINKS.tempReferrals,
      },
      {
        label: 'Brand assets',
        url: INTERNAL_LINKS.tempBrand,
      },
    ],
  },
  {
    title: 'Products',
    links: [
      {
        label: 'Borrow',
        url: INTERNAL_LINKS.tempBorrow,
      },
      {
        label: 'Multiply',
        url: INTERNAL_LINKS.tempMultiply,
      },
      {
        label: 'Earn',
        url: INTERNAL_LINKS.tempEarn,
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
            {links.map(({ label, url }, j) => {
              const isOutsideLink = url.startsWith('http')

              return (
                <li key={j}>
                  <Link prefetch={false} href={url} target={isOutsideLink ? '_blank' : undefined}>
                    <Text variant="p2">{label}</Text>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      {newsletter}
    </div>
  )
}
