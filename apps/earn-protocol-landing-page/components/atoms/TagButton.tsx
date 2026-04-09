import { type ReactNode } from 'react'

import tagButtonStyles from './TagButton.module.css'

export const TagButton = ({ children }: { children?: ReactNode }) => {
  return (
    <button className={tagButtonStyles.tagButton} type="button" disabled>
      {children}
    </button>
  )
}
