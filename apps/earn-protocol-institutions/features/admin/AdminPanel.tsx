'use client'

export const AdminPanel = ({ session }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel for managing institutions.</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
