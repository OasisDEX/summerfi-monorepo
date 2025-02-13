export type Styles = {
  content: string
  error: string
  header: string
  infoBox: string
  row: string
  rows: string
  title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
