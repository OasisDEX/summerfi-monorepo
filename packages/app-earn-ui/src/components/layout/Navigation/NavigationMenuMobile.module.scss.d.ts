export type Styles = {
  activeLink: string
  gradientInnerCircle: string
  gradientOuterCircle: string
  linksList: string
  linksListWrapper: string
  logoSmall: string
  topBar: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
