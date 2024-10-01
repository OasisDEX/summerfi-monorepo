export type Styles = {
  navigationMenu: string
  navigationMenuLink: string
  navigationMenuLinkElement: string
  navigationMenuLinkElementActive: string
  navigationMenuLinkElementOnClick: string
  navigationMenuList: string
  navigationMenuPanel: string
  navigationMenuPanelLabel: string
  navigationMenuPanelLabelActive: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
