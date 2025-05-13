import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

import gradientBoxStyles from './GradientBox.module.css'

type GradientBoxProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  withHover?: boolean
  selected?: boolean
}

export const GradientBox = ({
  children,
  className,
  style,
  selected,
  withHover,
  ...rest
}: GradientBoxProps): React.ReactNode => {
  return (
    <div
      className={clsx(className, gradientBoxStyles.gradientBoxWrapper, {
        [gradientBoxStyles.withHover]: !selected && withHover,
        [gradientBoxStyles.selected]: selected,
      })}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
