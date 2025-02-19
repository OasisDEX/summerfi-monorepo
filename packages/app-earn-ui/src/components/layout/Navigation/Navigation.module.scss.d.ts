export type Styles = {
  container: string
  logo: string
  logoSmall: string
  logoWrapper: string
  noNavMargin: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
