export type Styles = {
  buttonLeft: string
  buttonRight: string
  carouselButtons: string
  carouselContainer: string
  carouselContent: string
  slide: string
  slideActive: string
  slideLeft: string
  slideRight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
