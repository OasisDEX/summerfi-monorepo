export type Styles = {
  content: string
  contentDescription: string
  contentTextual: string
  imgWrapper: string
  shadow: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
