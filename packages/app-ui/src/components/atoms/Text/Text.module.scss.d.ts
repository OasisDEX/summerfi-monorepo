export type Styles = {
  h1: string
  h2: string
  h3: string
  h4: string
  h5: string
  hidden: string
  p1: string
  p1semi: string
  p2: string
  p2semi: string
  p3: string
  p3semi: string
  p4: string
  p4colorful: string
  p4semi: string
  p4semiColorful: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
