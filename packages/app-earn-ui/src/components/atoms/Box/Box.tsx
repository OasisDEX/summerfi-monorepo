import clsx from 'clsx'

import boxStyles from './Box.module.scss'

export const Box = ({
  children,
  className,
  light,
}: {
  children: React.ReactNode
  className?: string | string[]
  light?: boolean
}) => {
  return (
    <div
      className={clsx(boxStyles.box, className, {
        [boxStyles.light]: light,
      })}
    >
      {children}
    </div>
  )
}
