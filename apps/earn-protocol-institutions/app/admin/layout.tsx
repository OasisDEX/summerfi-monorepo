import { Button } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <Link href="/admin/institutions">
          <Button variant="primarySmall">Institutions</Button>
        </Link>
        <Link href="/admin/users">
          <Button variant="primarySmall">Users</Button>
        </Link>
      </div>
      {children}
    </div>
  )
}
