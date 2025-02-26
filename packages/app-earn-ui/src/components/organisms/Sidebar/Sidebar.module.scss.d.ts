export type Styles = {
  centered: string
  centerTitle: string
  goBackButton: string
  goBackButtonFillFLex: string
  sidebarContent: string
  sidebarCta: string
  sidebarErrorContent: string
  sidebarErrorWrapper: string
  sidebarFootnoteWrapper: string
  sidebarHeaderActionButtonsWrapper: string
  sidebarHeaderChevron: string
  sidebarHeaderSpacer: string
  sidebarHeaderWrapper: string
  sidebarTitle: string
  sidebarTitleWrapper: string
  sidebarWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
