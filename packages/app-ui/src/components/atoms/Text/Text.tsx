import { DetailedHTMLProps, FC, forwardRef, HTMLAttributes } from 'react'

import classes from '@/components/atoms/Text/Text.module.scss'

type AllowedHtmlTags =
  | 'address'
  | 'blockquote'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'p'
  | 'pre'
  | 'small'
  | 'span'
type AllowedClasses =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p1'
  | 'p1semi'
  | 'p2'
  | 'p2semi'
  | 'p3'
  | 'p3semi'
  | 'p4'
  | 'p4semi'

interface TextProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as?: AllowedHtmlTags
  variant?: AllowedClasses
}

export const Text: FC<TextProps> = forwardRef(
  ({ as = 'span', children, className, variant, ...props }, ref) => {
    const Component = as

    const classNames = [...(variant ? [classes[variant]] : []), ...(className ? [className] : [])]

    return (
      <Component
        {...{
          ref,
          ...(classNames.length && { className: classNames.join(' ') }),
          ...props,
        }}
      >
        {children}
      </Component>
    )
  },
)
