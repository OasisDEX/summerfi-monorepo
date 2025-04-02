export type Styles = {
  dataBlockDesktop: string
  dataBlockMobile: string
  dataPrimary: string
  dataSecondary: string
  vaultCardHomepageContentWrapper: string
  vaultCardHomepageContentWrapperSelected: string
  vaultCardHomepageDatablocksWrapper: string
  vaultCardHomepageDataRow: string
  vaultCardHomepageTitleWrapper: string
  vaultCardHomepageWrapper: string
  vaultCardHomepageWrapperSelected: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
