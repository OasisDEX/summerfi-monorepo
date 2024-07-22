export type Styles = {
  colorful: string
  critical: string
  interactive: string
  neutral: string
  primary: string
  success: string
  warning: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
