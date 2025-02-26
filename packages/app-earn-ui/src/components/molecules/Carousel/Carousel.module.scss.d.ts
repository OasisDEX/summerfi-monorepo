export type Styles = {
  buttonLeft: string
  buttonRight: string
  carouselButtons: string
  carouselContainer: string
  carouselContent: string
  mobileButton: string
  mobilePagination: string
  pip: string
  pipActive: string
  pips: string
  slide: string
  slideActive: string
  slideLeft: string
  slideRight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
