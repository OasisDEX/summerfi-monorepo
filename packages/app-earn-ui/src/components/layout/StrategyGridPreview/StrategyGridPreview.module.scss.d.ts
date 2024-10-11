export type Styles = {
  leftBlock: string
  rightBlock: string
  rightBlockWrapper: string
  strategyGridPreviewBreadcrumbsWrapper: string
  strategyGridPreviewPositionWrapper: string
  strategyGridPreviewTopLeftWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
