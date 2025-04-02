interface GetAtomClassListParams {
  variant?: string
  className?: string
}

export const getAtomClassList = ({ className, variant }: GetAtomClassListParams): string => {
  return [...(variant ? [variant] : []), ...(className ? [className] : [])].join(' ')
}
