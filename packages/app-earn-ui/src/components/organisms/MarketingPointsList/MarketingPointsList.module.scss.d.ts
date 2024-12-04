export type Styles = {
  fadeIn: string
  fadeOut: string
  marketingPointsListDetailsButton: string
  marketingPointsListDetailsButtonActive: string
  marketingPointsListDetailsButtons: string
  marketingPointsListDetailsContent: string
  marketingPointsListDetailsContentFadingOut: string
  marketingPointsListDetailsWrapper: string
  marketingPointsListHeader: string
  marketingPointsListHeaderWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
