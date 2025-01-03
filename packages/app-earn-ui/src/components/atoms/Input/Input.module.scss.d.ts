export type Styles = {
  dark: string
  default: string
  iconWrapper: string
  withBorder: string
  withIconOffset: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
