import { ReactNode } from 'react'

import titleStyles from '@/TitleExample.module.scss'

export const TitleExample = ({ children }: { children: ReactNode }) => {
  return <h1 className={titleStyles.title}>Titel :( {children}</h1>
}
