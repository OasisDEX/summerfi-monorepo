'use client'

import { type FC, type ReactNode, useEffect } from 'react'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { EXTERNAL_LINKS, INTERNAL_LINKS } from '@/helpers/application-links'
import { consoleInfo } from '@/helpers/console-info'
import { useHoldAlt } from '@/hooks/use-hold-alt'

import footerStyles from '@/components/layout/Footer/Footer.module.css'

interface FooterProps {
  logo: string
  languageSwitcher?: ReactNode
  newsletter: ReactNode
  onFooterItemClick?: (params: { buttonName: string; isEarnApp?: boolean }) => void
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
        label: '$SUMR Governance',
        url: EXTERNAL_LINKS.EARN.GOVERNANCE,
      },
      {
        label: 'Forum',
        url: EXTERNAL_LINKS.EARN.FORUM,
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
        label: 'Summer.fi Pro',
        url: INTERNAL_LINKS.summerPro,
      },
      {
        label: '$SUMR',
        url: INTERNAL_LINKS.tempSumr,
      },
    ],
  },
]

export const Footer: FC<FooterProps> = ({
  logo,
  newsletter,
  languageSwitcher,
  onFooterItemClick,
}) => {
  // listen to holding ALT button
  const isAltPressed = useHoldAlt()

  useEffect(() => {
    consoleInfo()
  }, [])

  return (
    <div className={footerStyles.container}>
      <div>
        <img src={logo} alt="Summer.fi" className={footerStyles.logo} />
        <ul className={footerStyles.socialsList}>
          <li>
            <Link
              href="https://twitter.com/summerfinance_"
              target="_blank"
              rel="noreferrer"
              onClick={() => onFooterItemClick?.({ buttonName: 'twitter' })}
            >
              <Icon
                iconName="brand_icon_twitter"
                size={20}
                color="var(--color-background-primary)"
              />
            </Link>
          </li>
          <li>
            <Link
              href="https://discord.com/invite/summerfi"
              target="_blank"
              rel="noreferrer"
              onClick={() => onFooterItemClick?.({ buttonName: 'discord' })}
            >
              <Icon
                iconName="brand_icon_discord"
                size={20}
                color="var(--color-background-primary)"
              />
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/OasisDEX"
              target="_blank"
              rel="noreferrer"
              onClick={() => onFooterItemClick?.({ buttonName: 'github' })}
            >
              <Icon
                iconName="brand_icon_github"
                size={20}
                color="var(--color-background-primary)"
              />
            </Link>
          </li>
        </ul>
        {isAltPressed && (
          <Text variant="p3semiColorful">
            <Link
              href={
                process.env.NEXT_PUBLIC_SHA
                  ? `https://github.com/OasisDEX/summerfi-monorepo/commit/${process.env.NEXT_PUBLIC_SHA}`
                  : '#'
              }
              onClick={() => onFooterItemClick?.({ buttonName: 'sha-commit' })}
            >
              SHA Commit:&nbsp;{process.env.NEXT_PUBLIC_SHA ?? 'none'}
            </Link>
          </Text>
        )}
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
                  <Link
                    prefetch={false}
                    href={url}
                    target={isOutsideLink ? '_blank' : undefined}
                    onClick={() =>
                      onFooterItemClick?.({
                        buttonName: label.toLowerCase().replace(/\s+/gu, '-').replace(/\?/gu, ''),
                      })
                    }
                  >
                    <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                      {label}
                    </Text>
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
