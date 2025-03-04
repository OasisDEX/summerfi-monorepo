export type Styles = {
  divider: string
  positionCardBanner: string
  positionCardHeader: string
  positionCardHeaderIcon: string
  positionCardHeaderIconActive: string
  positionCardWrapper: string
  positionSubHeader: string
  positionSubHeaderAmount: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
