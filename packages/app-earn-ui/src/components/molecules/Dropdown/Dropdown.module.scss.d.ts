export type Styles = {
  disabled: string
  dropdown: string
  dropdownOption: string
  dropdownOptions: string
  dropdownOverflowWrapper: string
  dropdownSelected: string
  dropdownShow: string
  mobileContentWrapper: string
  searchInput: string
  selected: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
