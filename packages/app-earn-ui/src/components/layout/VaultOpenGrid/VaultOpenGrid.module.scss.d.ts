export type Styles = {
  leftBlock: string
  refreshing: string
  refreshWrapper: string
  rightBlock: string
  rightBlockMobile: string
  rightBlockWrapper: string
  rightExtraBlockMobileWrapper: string
  rotate: string
  vaultBonusWrapper: string
  vaultOpenGridBreadcrumbsWrapper: string
  vaultOpenGridPositionWrapper: string
  vaultOpenGridTopLeftWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
