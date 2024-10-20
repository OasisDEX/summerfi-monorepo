export type Styles = {
  activeLink: string
  inactiveLink: string
  navigationItemsIconWrapper: string
  navigationItemsItem: string
  navigationItemsWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
