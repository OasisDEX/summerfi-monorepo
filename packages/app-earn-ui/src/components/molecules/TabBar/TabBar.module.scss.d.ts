export type Styles = {
  active: string
  tabBar: string
  tabButton: string
  tabContent: string
  tabHeaders: string
  tabHeaderWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
