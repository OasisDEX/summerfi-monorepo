export type Styles = {
  leftBlock: string
  rightBlock: string
  rightBlockMobile: string
  rightBlockWrapper: string
  vaultManageGridBreadcrumbsWrapper: string
  vaultManageGridPositionWrapper: string
  vaultManageGridTopLeftWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
