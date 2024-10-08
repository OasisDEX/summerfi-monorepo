export type Styles = {
  default: string
  smallLeftPadding: string
  smallRightPadding: string
  smallXPaddings: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
