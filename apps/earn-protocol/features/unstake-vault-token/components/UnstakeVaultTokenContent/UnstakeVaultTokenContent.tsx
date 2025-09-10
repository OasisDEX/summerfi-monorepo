import { type FC, type PropsWithChildren } from 'react'

import classNames from './UnstakeVaultTokenContent.module.css'

export const UnstakeVaultTokenContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classNames.unstakeVaultTokenContentWrapper}>
      <div className={classNames.divider} />
      {children}
    </div>
  )
}
