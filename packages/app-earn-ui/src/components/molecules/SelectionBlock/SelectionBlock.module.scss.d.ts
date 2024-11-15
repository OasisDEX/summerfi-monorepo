export type Styles = {
  active: string
  selectionBlockBorderWrapper: string
  selectionBlockWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
