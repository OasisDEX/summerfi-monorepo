export type Styles = {
  content: string
  errorMessageWrapper: string
  errorText: string
  errorTextWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
