export type Styles = {
  customRow: string
  details: string
  expandedRow: string
  table: string
  tableWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
