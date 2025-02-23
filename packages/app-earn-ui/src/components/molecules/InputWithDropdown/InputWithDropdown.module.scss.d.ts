export type Styles = {
  headingWrapper: string
  headingWrapperAction: string
  headingWrapperActionDisabled: string
  inputWrapper: string
  tagsWrapper: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
