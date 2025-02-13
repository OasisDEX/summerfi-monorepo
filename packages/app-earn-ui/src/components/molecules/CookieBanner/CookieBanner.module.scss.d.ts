export type Styles = {
  buttonsWrapper: string
  cookieBannerContent: string
  cookieBannerWrapper: string
  expanderContent: string
  expanderContentConfig: string
  expanderContentTextual: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
