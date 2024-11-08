export type Styles = {
  bottomDefault: string
  bottomSidebar: string
  closeButton: string
  content: string
  drawer: string
  drawerContentDefault: string
  drawerContentSidebar: string
  open: string
  overlay: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
