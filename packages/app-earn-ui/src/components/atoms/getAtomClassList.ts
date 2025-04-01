import { type DetailedHTMLProps, type HTMLAttributes } from 'react'

interface GetAtomClassListParams {
  variant?: string
  className?: string
}

export const getAtomClassList = ({ className, variant }: GetAtomClassListParams): string => {
  return [...(variant ? [variant] : []), ...(className ? [className] : [])].join(' ')
}

export type AtomProps<AllowedHtmlTags, AtomPropsClasses> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  as?: AllowedHtmlTags
  variant?: AtomPropsClasses
}
