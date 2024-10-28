export type Styles = {
  card: string
  cardDescription: string
  cardsWrapper: string
  cardTitle: string
  description: string
  heading: string
  headingIcons: string
  wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
