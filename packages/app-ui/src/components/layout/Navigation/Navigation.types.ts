import { ReactNode } from 'react'
import { ProtocolId } from '@summerfi/serverless-shared'

import { IconProps } from '@/components/atoms/Icon/Icon'

export type NavigationModule = 'swap' | 'bridge'

export interface NavigationMenuPanelLink {
  icon: IconProps['icon']
  title: string
  link: string
  hash?: string
  footnote?: ReactNode
}

export interface NavigationMenuPanelIcon {
  icon?: IconProps['icon']
  image?: string
  tokens?: string[]
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

export interface NavigationMenuPanelLink {
  icon: IconProps['icon']
  title: string
  link: string
  hash?: string
  footnote?: ReactNode
}

export interface NavigationMenuPanelIcon {
  icon?: IconProps['icon']
  image?: string
  tokens?: string[]
  position: 'global' | 'title'
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
    NavigationModuleSwap: () => React.JSX.Element
    NavigationModuleBridge: () => React.JSX.Element
  }
}
