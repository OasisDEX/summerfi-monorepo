export type Styles = {
  description: string
  leftTextualWrapper: string
  leftWrapper: string
  link: string
  linkWrapper: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
