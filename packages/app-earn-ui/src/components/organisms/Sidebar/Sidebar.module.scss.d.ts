export type Styles = {
  sidebarErrorWrapper: string
  sidebarFootnoteWrapper: string
  sidebarHeaderActionButtonsWrapper: string
  sidebarHeaderChevron: string
  sidebarHeaderSpacer: string
  sidebarHeaderWrapper: string
  sidebarWrapper: string
  sidebarWrapperDesktop: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
