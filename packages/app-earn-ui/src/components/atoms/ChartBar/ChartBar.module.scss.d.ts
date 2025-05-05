export type Styles = {
  bar: string
  barFilled: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
