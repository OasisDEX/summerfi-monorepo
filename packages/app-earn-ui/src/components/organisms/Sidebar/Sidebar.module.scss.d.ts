export type Styles = {
  sidebarBannerWrapper: string
  sidebarFootnoteWrapper: string
  sidebarHeaderSpacer: string
  sidebarHeaderWrapper: string
  sidebarWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
