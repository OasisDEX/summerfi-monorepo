export type Styles = {
  container: string
  logo: string
  logoSmall: string
  logoWrapper: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
