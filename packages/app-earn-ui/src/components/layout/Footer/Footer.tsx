'use client'

import { type FC, type ReactNode, useEffect } from 'react'
import { slugify } from '@summerfi/app-utils'
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

export const Footer: FC<FooterProps> = ({
  logo,
  newsletter,
  languageSwitcher,
  onFooterItemClick,
}) => {
  const isAltPressed = useHoldAlt()

  const linksList = [
    {
      title: 'About',
      links: [
        {
          label: 'Team',
          url: '/landing_page/about',
        },
        {
          label: 'Contact',
          url: EXTERNAL_LINKS.KB.CONTACT,
        },
        {
          label: 'Privacy',
          url: '/landing_page/privacy',
        },
        {
          label: 'Cookie Policy',
          url: '/landing_page/cookie',
        },
        {
          label: 'Terms',
          url: '/landing_page/terms',
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
      ],
    },
    {
      title: 'Products',
      links: [
        {
          label: '$SUMR',
          url: INTERNAL_LINKS.sumr,
        },
      ],
    },
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      consoleInfo()
    }, 3000)

    return () => clearTimeout(timeout)
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
              href="https://chat.summer.fi"
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
              target="_blank"
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
              const isLandingPageLink = url.startsWith('/landing_page')
              const isInternalEarnAppLink = url.startsWith('/earn') && !isLandingPageLink

              const isOutsideLink = url.startsWith('http') || isInternalEarnAppLink
              const resolvedUrl = isLandingPageLink ? url.replace('/landing_page', '') : url

              const textNode = (
                <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  {label}
                </Text>
              )

              return (
                <li key={j}>
                  {isLandingPageLink || isOutsideLink ? (
                    <a
                      href={resolvedUrl}
                      target={isOutsideLink ? '_blank' : undefined}
                      rel="noreferrer"
                      onClick={() => onFooterItemClick?.({ buttonName: slugify(label) })}
                    >
                      {textNode}
                    </a>
                  ) : (
                    <Link
                      prefetch
                      href={resolvedUrl}
                      onClick={() => onFooterItemClick?.({ buttonName: slugify(label) })}
                    >
                      {textNode}
                    </Link>
                  )}
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
