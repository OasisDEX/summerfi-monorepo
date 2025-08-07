'use client'

import { useUser } from '@/contexts/UserDataContext/UserDataContext'

export const AdminPanel = () => {
  const { isLoading, user } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel for managing institutions.</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
