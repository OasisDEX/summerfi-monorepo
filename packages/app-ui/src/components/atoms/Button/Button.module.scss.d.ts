export type Styles = {
  colorful: string
  neutralLarge: string
  neutralSmall: string
  primaryLarge: string
  primarySmall: string
  secondaryLarge: string
  secondarySmall: string
  textLarge: string
  textMedium: string
  textPrimaryLarge: string
  textPrimaryMedium: string
  textPrimarySmall: string
  textSmall: string
  unstyled: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
