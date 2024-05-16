import { FC } from 'react'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandTwitterFilled,
} from '@tabler/icons-react'

import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/layout/Footer/Footer.module.scss'

interface FooterProps {
  logo: string
  lists: {
    title: string
    links: {
      label: string
      url: string
    }[]
  }[]
  newsletter: {
    title: string
    description: string
    label: string
    button: string
  }
}

export const Footer: FC<FooterProps> = ({ lists, logo, newsletter }) => {
  return (
    <div className={classNames.container}>
      <div>
        <img src={logo} alt="Summer.fi" className={classNames.logo} />
        <ul className={classNames.socialsList}>
          <li>
            <a href="https://twitter.com/summerfinance_" target="_blank" rel="noreferrer">
              <IconBrandTwitterFilled />
            </a>
          </li>
          <li>
            <a href="https://discord.com/invite/summerfi" target="_blank" rel="noreferrer">
              <IconBrandDiscordFilled />
            </a>
          </li>
          <li>
            <a href="https://github.com/OasisDEX" target="_blank" rel="noreferrer">
              <IconBrandGithubFilled />
            </a>
          </li>
        </ul>
      </div>
      {lists.map(({ links, title }, i) => (
        <div key={i}>
          <Text as="h3" variant="p1semi">
            {title}
          </Text>
          <ul className={classNames.linksList}>
            {links.map(({ label, url }, j) => (
              <li key={j}>
                <a
                  href={url}
                  {...(url.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                >
                  <Text variant="p2">{label}</Text>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <Text as="h3" variant="p1semi">
          {newsletter.title}
        </Text>
        <Text as="p" variant="p2" className={classNames.newsletterDescription}>
          {newsletter.description}
        </Text>
        <div className={classNames.newsletterFakeInput}>
          <Text variant="p3" className={classNames.newsletterFakeLabel}>
            {newsletter.label}
          </Text>
          <Text variant="p3semi">{newsletter.button}</Text>
        </div>
      </div>
    </div>
  )
}
