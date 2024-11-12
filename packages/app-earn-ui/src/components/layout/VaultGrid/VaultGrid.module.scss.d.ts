export type Styles = {
  fullWidthBlock: string
  leftBlock: string
  rightBlock: string
  rightBlockWrapper: string
  vaultGridHeaderWrapper: string
  vaultGridPositionWrapper: string
  vaultGridWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
