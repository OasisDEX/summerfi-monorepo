import { AdminPanelNavigation } from '@/features/admin/AdminPanelNavigation'

import adminLayoutStyles from './layout.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={adminLayoutStyles.wrapper}>
      <AdminPanelNavigation />
      {children}
    </div>
  )
}
