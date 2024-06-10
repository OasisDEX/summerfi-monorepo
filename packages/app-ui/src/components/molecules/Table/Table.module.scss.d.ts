export type Styles = {
  leftAlign: string
  rightAlign: string
  table: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
