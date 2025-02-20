export type Styles = {
  firstLayerCircle: string
  secondLayerCircle: string
  sizeLarge: string
  sizeMedium: string
  sizeSmall: string
  thirdLayerCircle: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
