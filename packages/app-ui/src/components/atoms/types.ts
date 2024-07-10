import { type DetailedHTMLProps, type HTMLAttributes } from 'react'

export type AtomProps<AllowedHtmlTags, ClassNames> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  as?: AllowedHtmlTags
  variant?: ClassNames
}
