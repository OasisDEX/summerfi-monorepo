import clsx from 'clsx'

import boxStyles from './Box.module.scss'

export const Box = ({
  children,
  className,
  light,
  style,
}: {
  children: React.ReactNode
  className?: string | string[]
  light?: boolean
  style?: React.CSSProperties
}): React.ReactNode => {
  return (
    <div
      className={clsx(boxStyles.box, className, {
        [boxStyles.light]: light,
      })}
      style={style}
    >
      {children}
    </div>
  )
}
