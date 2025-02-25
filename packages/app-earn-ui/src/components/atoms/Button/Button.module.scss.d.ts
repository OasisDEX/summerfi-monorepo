export type Styles = {
  colorful: string
  neutralLarge: string
  neutralMedium: string
  neutralSmall: string
  primaryLarge: string
  primaryMedium: string
  primarySmall: string
  secondaryLarge: string
  secondaryLargeActive: string
  secondaryMedium: string
  secondaryMediumActive: string
  secondarySmall: string
  secondarySmallActive: string
  unstyled: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
