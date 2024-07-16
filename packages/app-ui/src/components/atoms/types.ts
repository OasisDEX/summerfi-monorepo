import { type DetailedHTMLProps, type HTMLAttributes } from 'react'

export type AtomProps<AllowedHtmlTags, AtomPropsClasses> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  as?: AllowedHtmlTags
  variant?: AtomPropsClasses
}
