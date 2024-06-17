export type Styles = {
  container: string
  linksList: string
  logo: string
  newsletterDescription: string
  newsletterFakeInput: string
  newsletterFakeLabel: string
  socialsList: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
