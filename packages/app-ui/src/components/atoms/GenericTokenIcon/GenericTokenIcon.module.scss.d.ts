export type Styles = {
  largeIcon: string
  smallIcon: string
  unknownIcon: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
