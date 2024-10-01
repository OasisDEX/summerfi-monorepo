export type Styles = {
  container: string
  linksList: string
  logo: string
  socialsList: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
