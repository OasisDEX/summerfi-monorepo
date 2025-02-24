export type Styles = {
  alertTextWrapper: string
  alertWrapper: string
  content: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
