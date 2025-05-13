import { Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './PortfolioRewardsMore.module.css'

const links = [
  {
    label: 'Everything you need to know about $SUMR',
    href: '/',
  },
  {
    label: 'When and how $RAYS turn into $SUMR',
    href: '/',
  },
]

export const PortfolioRewardsMore = () => {
  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        More about Rewards & $SUMR
      </Text>
      <ul className={classNames.list}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>
              <WithArrow
                as="p"
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                {link.label}
              </WithArrow>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
