export type Styles = {
  bottomDefault: string
  bottomSidebar: string
  closeButton: string
  content: string
  drawer: string
  drawerContentDefault: string
  drawerContentSidebar: string
  leftDefault: string
  leftSidebar: string
  open: string
  overlay: string
  rightDefault: string
  rightSidebar: string
  topDefault: string
  topSidebar: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
