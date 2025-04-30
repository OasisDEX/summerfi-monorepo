import { type ReactNode } from 'react'

import chartBarStyles from './ChartBar.module.scss'

export const ChartBar = ({ value }: { value: string }): ReactNode => {
  return (
    <div className={chartBarStyles.bar}>
      <div
        className={chartBarStyles.barFilled}
        style={{
          width: value,
        }}
      />
    </div>
  )
}
