export type Styles = {
  accent: string
  centered: string
  dataBlockWrapper: string
  hasAccent: string
  titleWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
