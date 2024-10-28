export type Styles = {
  leftBlock: string
  rightBlock: string
  rightBlockWrapper: string
  vaultGridPreviewBreadcrumbsWrapper: string
  vaultGridPreviewPositionWrapper: string
  vaultGridPreviewTopLeftWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
