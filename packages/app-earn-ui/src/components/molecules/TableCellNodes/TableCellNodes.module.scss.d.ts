export type Styles = {
  medium: string
  small: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
