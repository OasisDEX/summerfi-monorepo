export type Styles = {
  active: string
  activeLink: string
  closeIcon: string
  linksList: string
  menuMobileOverflow: string
  menuMobileWrapper: string
  topBar: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
