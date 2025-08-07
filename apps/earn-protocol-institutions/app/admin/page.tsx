import { cookies } from 'next/headers'

import { UserDataProvider } from '@/contexts/UserDataContext/UserDataContext'
import { AdminPanel } from '@/features/admin/AdminPanel'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    throw new Error('Unauthorized')
  }

  return (
    <UserDataProvider>
      <AdminPanel />
    </UserDataProvider>
  )
}
