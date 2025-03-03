export type Styles = {
  colorful: string
  neutralLarge: string
  neutralMedium: string
  neutralSmall: string
  primaryLarge: string
  primaryLargeColorful: string
  primaryMedium: string
  primaryMediumColorful: string
  primarySmall: string
  primarySmallColorful: string
  secondaryLarge: string
  secondaryLargeActive: string
  secondaryMedium: string
  secondaryMediumActive: string
  secondarySmall: string
  secondarySmallActive: string
  textPrimaryLarge: string
  textPrimaryMedium: string
  textPrimarySmall: string
  textSecondaryLarge: string
  textSecondaryMedium: string
  textSecondarySmall: string
  unstyled: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
