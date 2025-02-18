export type Styles = {
  content: string
  error: string
  header: string
  infoBox: string
  noTitle: string
  row: string
  rows: string
  separator: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
