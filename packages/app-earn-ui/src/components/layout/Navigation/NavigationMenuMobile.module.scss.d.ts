export type Styles = {
  navigationMenuMobileHeader: string
  navigationMenuMobileLink: string
  navigationMenuMobileLinkIsOpen: string
  navigationMenuMobileUl: string
  navigationMenuMobileWrapper: string
  navigationMenuMobileWrapperActive: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
