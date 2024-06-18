export type Styles = {
  arrow: string
  arrowActive: string
  navigationMenu: string
  navigationMenuActive: string
  navigationMenuDropdownBlock: string
  navigationMenuDropdownBlockActive: string
  navigationMenuDropdownBlockInside: string
  navigationMenuDropdownBlockInsideActive: string
  navigationMenuDropdownPanelWrapper: string
  navigationMenuDropdownPanelWrapperIsCurrentPanel: string
  navigationMenuDropdownPanelWrapperIsPanelSwitched: string
  navigationMenuDropdownWrapper: string
  navigationMenuPointer: string
  navigationMenuPointerActive: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
