import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanel } from '@/features/admin/AdminPanel'

export default async function AdminPage() {
  const session = await readSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return <AdminPanel session={session} />
}
