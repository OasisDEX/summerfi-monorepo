export type Styles = {
  bannerWrapper: string
  bannerWrapperCritical: string
  bannerWrapperSuccess: string
  bannerWrapperVisible: string
  bannerWrapperWarning: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
