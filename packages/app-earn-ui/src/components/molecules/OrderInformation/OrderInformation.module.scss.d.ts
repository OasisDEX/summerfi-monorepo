export type Styles = {
  label: string
  listItem: string
  orderInformationList: string
  orderInformationListInExpander: string
  orderInformationWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
