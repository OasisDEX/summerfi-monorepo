import { type FC, type PropsWithChildren } from 'react'

import masterPageStyles from './MasterPage.module.scss'

interface MasterPageProps {}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = async ({ children }) => {
  return (
    <div className={masterPageStyles.mainContainer}>
      Navigation :)
      <div className={masterPageStyles.appContainer}>
        {children}
        <div style={{ marginTop: '100px', textAlign: 'center' }}>Footer (:</div>
      </div>
    </div>
  )
}
