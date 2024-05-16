interface GetAtomClassListParams {
  variant: string
  className?: string
}

export const getAtomClassList = ({ className, variant }: GetAtomClassListParams) => {
  return [...(variant ? [variant] : []), ...(className ? [className] : [])].join(' ')
}
