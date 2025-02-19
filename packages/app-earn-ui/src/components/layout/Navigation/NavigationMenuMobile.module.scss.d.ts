export type Styles = {
  activeLink: string
  buttonWrapper: string
  gradientInnerCircle: string
  gradientOuterCircle: string
  linksList: string
  linksListWrapper: string
  logoSmall: string
  spacer: string
  topBar: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
