export type Styles = {
  bottomDefault: string
  bottomSidebar: string
  closeButton: string
  content: string
  drawer: string
  drawerBottomContentSidebar: string
  drawerContentDefault: string
  drawerContentSidebar: string
  drawerLeftContentSidebar: string
  drawerRightContentSidebar: string
  drawerTopContentSidebar: string
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
