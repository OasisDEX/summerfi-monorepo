export type Styles = {
  cardGradientDark: string
  cardGradientLight: string
  cardPrimary: string
  cardPrimaryColorfulBorder: string
  cardPrimaryMediumPaddings: string
  cardPrimaryMediumPaddingsColorfulBorder: string
  cardPrimarySmallPaddings: string
  cardPrimarySmallPaddingsColorfulBorder: string
  cardSecondary: string
  cardSecondaryColorfulBorder: string
  cardSecondaryMediumPaddings: string
  cardSecondaryMediumPaddingsColorfulBorder: string
  cardSecondarySmallPaddings: string
  cardSecondarySmallPaddingsColorfulBorder: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
