export type Styles = {
  firstLayerCircle: string
  secondLayerCircle: string
  thirdLayerCircle: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
