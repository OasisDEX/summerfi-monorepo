'use client'
import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logout } from '@/app/server-handlers/auth/logout'
import { useAuth } from '@/contexts/AuthContext/AuthContext'

import adminPanelNavigationStyles from './AdminPanelNavigation.module.css'

export const AdminPanelNavigation = () => {
  const pathname = usePathname()
  const user = useAuth()

  const links = [
    { href: '/admin/institutions', label: 'Institutions' },
    { href: '/admin/users', label: 'Users' },
  ]

  const activePageLabel = links.find((link) => link.href === pathname)?.label

  return (
    <div className={adminPanelNavigationStyles.container}>
      <Text variant="h1">{activePageLabel}</Text>
      <div className={adminPanelNavigationStyles.links}>
        <div>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant={pathname === link.href ? 'primarySmall' : 'textPrimarySmall'}>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
        <form action={logout}>
          <Button variant="secondarySmall" type="submit">
            Log out ({user.user?.email})
          </Button>
        </form>
      </div>
    </div>
  )
}
