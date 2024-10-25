export type Styles = {
  background1: string
  background2: string
  childrenWrapper: string
  default: string
  smallLeftPadding: string
  smallRightPadding: string
  smallXPaddings: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
