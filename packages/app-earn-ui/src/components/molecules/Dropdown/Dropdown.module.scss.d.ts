export type Styles = {
  dropdown: string
  dropdownOption: string
  dropdownOptions: string
  dropdownSelected: string
  dropdownShow: string
  selected: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
