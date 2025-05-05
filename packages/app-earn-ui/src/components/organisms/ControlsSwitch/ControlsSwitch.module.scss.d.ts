export type Styles = {
  activeFilter: string
  arrowForward: string
  cardWrapper: string
  dataRow: string
  dataRowColumn: string
  nextPositionIconFilterButton: string
  nextPositionIconsInfo: string
  nextPositionInfo: string
  nextVaultCard: string
  nextVaultCardNotSelected: string
  positionAndVaultsListWrapper: string
  title: string
  titleRow: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
