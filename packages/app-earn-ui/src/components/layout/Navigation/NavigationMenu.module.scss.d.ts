export type Styles = {
  active: string
  dropdownContent: string
  dropdownContentWrapper: string
  navigationMenu: string
  navigationMenuLinks: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
