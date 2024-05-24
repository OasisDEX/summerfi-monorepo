export type Styles = {
  headingWithEffect: string
  itemHoverEffectDefault: string
  itemHoverEffectHover: string
  navIcon: string
  navigationMenuDropdownContentListHeader: string
  navigationMenuDropdownContentListWrapper: string
  navigationMenuDropdownContentListWrapperItem: string
  navigationMenuDropdownContentListWrapperItemLink: string
  navigationMenuDropdownContentListWrapperItemLinkTight: string
  starWithEffect: string
  tagWithEffect: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
