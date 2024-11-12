export type Styles = {
  activeLink: string
  closeIcon: string
  linksList: string
  logoSmall: string
  topBar: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
