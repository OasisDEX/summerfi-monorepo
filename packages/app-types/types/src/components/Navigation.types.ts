import { ReactNode } from 'react'
import { IconNamesList, TokenSymbolsList } from '../icons'

export type NavigationModule = 'swap' | 'bridge'

export interface NavigationMenuPanelLink {
  icon: IconNamesList
  title: string
  link: string
  hash?: string
  footnote?: ReactNode
}

export interface NavigationMenuPanelIcon {
  icon?: IconNamesList
  image?: string
  tokens?: TokenSymbolsList[]
  position: 'global' | 'title'
}

export type NavigationBrandingPillColor = string | [string, string]

export interface NavigationBrandingPill {
  color: NavigationBrandingPillColor
  label: string
}

export interface NavigationBrandingProps {
  link?: string
  pill?: NavigationBrandingPill
}

interface NavigationMenuPanelLinkWithUrl {
  link: string
  onClick?: never
}

interface NavigationMenuPanelLinkWithAction {
  link?: never
  onClick: () => void
}

export type NavigationMenuPanelLinkType = (
  | NavigationMenuPanelLinkWithUrl
  | NavigationMenuPanelLinkWithAction
) & {
  label: ReactNode
}
export type NavigationMenuPanelLinkProps = NavigationMenuPanelLinkType & {
  currentPath: string
  onMouseEnter(): void
}
export interface NavigationMenuPanelAsset {
  token: string
  link: string
}

export type NavigationMenuPanelListTags = ([string, string] | string)[]

export interface NavigationMenuPanelList {
  header?: string
  items: {
    description?: ReactNode
    protocolName?: string
    icon?: NavigationMenuPanelIcon
    list?: NavigationMenuPanelList
    navigationModule?: NavigationModule
    promoted?: boolean
    tags?: NavigationMenuPanelListTags
    title: ReactNode
    url?: string
  }[]
  link?: {
    label: string
    query?: { [key: string]: string }
    url: string
  }
  tight?: boolean
}
export interface NavigationMenuPanelType {
  label: string
  lists: NavigationMenuPanelList[]
  url?: string
}
export type NavigationMenuPanelProps = NavigationMenuPanelType & {
  currentPanel?: string
  isPanelOpen: boolean
  onMouseEnter(center: number): void
}

export interface NavigationProps {
  actions?: ReactNode
  brandingLink?: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
  pill?: NavigationBrandingPill
}

export interface WithNavigationModules {
  navigationModules?: {
    NavigationModuleSwap: React.JSX.Element
    NavigationModuleBridge: React.JSX.Element
  }
}
