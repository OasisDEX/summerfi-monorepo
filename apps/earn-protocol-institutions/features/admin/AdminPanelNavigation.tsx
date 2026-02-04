'use client'
import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import adminPanelNavigationStyles from './AdminPanelNavigation.module.css'

export const AdminPanelNavigation = () => {
  const pathname = usePathname()

  const links = [
    { href: '/admin/institutions', label: <>Institutions</> },
    { href: '/admin/users', label: <>Users</> },
    { href: '/admin/global-admins', label: <>Global&nbsp;Admins</> },
    { href: '/admin/feedback', label: <>Feedback</> },
  ]

  const activePageLabel = links.find((link) => pathname.startsWith(link.href))?.label

  return (
    <div className={adminPanelNavigationStyles.container}>
      <Text variant="h1">{activePageLabel}</Text>
      <div className={adminPanelNavigationStyles.links}>
        <div>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname.startsWith(link.href) ? 'primarySmall' : 'textPrimarySmall'}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
