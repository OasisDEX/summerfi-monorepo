import { type FC, type ReactNode } from 'react'

import styles from './DashboardContentLayout.module.css'

interface DashboardContentLayoutProps {
  panel: ReactNode
  header?: ReactNode
  children: ReactNode
}

export const DashboardContentLayout: FC<DashboardContentLayoutProps> = ({
  panel,
  header,
  children,
}) => {
  return (
    <div className={styles.dashboardContentLayout}>
      <div className={styles.panel}>{panel}</div>
      <div className={styles.content}>
        {header && <div className={styles.header}>{header}</div>}
        {children}
      </div>
    </div>
  )
}
