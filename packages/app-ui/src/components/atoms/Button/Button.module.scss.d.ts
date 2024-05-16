export type Styles = {
  neutralLarge: string
  neutralSmall: string
  primaryLarge: string
  primarySmall: string
  secondaryLarge: string
  secondarySmall: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
