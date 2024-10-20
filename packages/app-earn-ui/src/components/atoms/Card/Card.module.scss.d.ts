export type Styles = {
  cardPrimary: string
  cardPrimarySmallPaddings: string
  cardSecondary: string
  cardSecondarySmallPaddings: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
