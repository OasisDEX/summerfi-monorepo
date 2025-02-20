export type Styles = {
  h1: string
  h1colorful: string
  h1semi: string
  h2: string
  h2colorful: string
  h2semi: string
  h3: string
  h3colorful: string
  h3semi: string
  h4: string
  h4colorful: string
  h4semi: string
  h5: string
  h5colorful: string
  h5semi: string
  hidden: string
  p1: string
  p1colorful: string
  p1semi: string
  p1semiColorful: string
  p2: string
  p2colorful: string
  p2semi: string
  p2semiColorful: string
  p3: string
  p3colorful: string
  p3semi: string
  p3semiColorful: string
  p4: string
  p4colorful: string
  p4semi: string
  p4semiColorful: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
