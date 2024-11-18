export type Styles = {
  centerTitle: string
  goBackButton: string
  goBackButtonFillFLex: string
  sidebarErrorWrapper: string
  sidebarFootnoteWrapper: string
  sidebarHeaderActionButtonsWrapper: string
  sidebarHeaderChevron: string
  sidebarHeaderSpacer: string
  sidebarHeaderWrapper: string
  sidebarTitle: string
  sidebarWrapper: string
  sidebarWrapperDesktop: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
