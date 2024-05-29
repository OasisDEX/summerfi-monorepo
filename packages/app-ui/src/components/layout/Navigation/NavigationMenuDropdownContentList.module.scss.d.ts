export type Styles = {
  itemHoverEffectDefault: string
  itemHoverEffectHover: string
  navigationMenuDropdownContentListHeader: string
  navigationMenuDropdownContentListWrapper: string
  navigationMenuDropdownContentListWrapperItem: string
  navigationMenuDropdownContentListWrapperItemLink: string
  navigationMenuDropdownContentListWrapperItemLinkTight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
