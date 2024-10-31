export type Styles = {
  leftBlock: string
  rightBlock: string
  rightBlockWrapper: string
  vaultOpenGridBreadcrumbsWrapper: string
  vaultOpenGridPositionWrapper: string
  vaultOpenGridTopLeftWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
