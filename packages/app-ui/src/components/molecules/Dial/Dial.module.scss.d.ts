export type Styles = {
  dial: string
  dialContainer: string
  progress: string
  track: string
  trackWidth1: string
  trackWidth2: string
  trackWidth3: string
  trackWidth4: string
  value: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
