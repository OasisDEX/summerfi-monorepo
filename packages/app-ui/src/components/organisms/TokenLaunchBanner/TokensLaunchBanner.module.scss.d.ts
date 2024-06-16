export type Styles = {
  content: string
  countDown: string
  countDownItem: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
