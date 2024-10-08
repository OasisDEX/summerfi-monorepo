export type Styles = {
  chevron: string
  collapsed: string
  expanded: string
  expander: string
  expanderButton: string
  expanderContent: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
