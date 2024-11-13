export type Styles = {
  animateSpin: string
  animateSpinAppear: string
  animateSpinFast: string
  animateSpinFastAppear: string
  appearAnimation: string
  spinAnimation: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
