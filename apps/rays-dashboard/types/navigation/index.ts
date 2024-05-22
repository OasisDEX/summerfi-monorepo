import { ReactNode } from 'react'
import { ProtocolId } from '@summerfi/serverless-shared'

import { FeaturesEnum } from '@/types/generated'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubSupportedNetworks } from '@/types/product-hub'

type NavigationModule = 'swap' | 'bridge'

interface NavigationLink {
  __typename: 'NavigationLink'
  description: string
  featureFlag?: FeaturesEnum
  label: string
  link?: string
  protocol?: {
    slug: ProtocolId
  }
  token?: string
  star: boolean
}

export interface NavigationFeaturedProduct {
  __typename: 'FeaturedProduct'
  detailedFilters?: {
    id: string
    key: string
    value: string
  }[]
  label?: string
  network: {
    slug: ProductHubSupportedNetworks
  }
  primaryToken: string
  secondaryToken: string
  protocol: {
    slug: ProtocolId
  }
  product: {
    slug: OmniProductType
  }
}

interface NavigationTopProducts {
  __typename: 'NavigationTopProducts'
  product: {
    slug: OmniProductType
  }
}

interface NavigationTopToken {
  __typename: 'NavigationTopToken'
  token: string
}

interface NavigationSpecialModule {
  __typename: 'NavigationSpecialModule'
  moduleName: NavigationModule[]
}

interface NavigationLinkWithNestedLinks extends NavigationLink {
  nestedLinks: {
    title: string
    displayTitle: boolean
    linksListCollection: {
      items: (
        | NavigationLink
        | NavigationFeaturedProduct
        | NavigationTopProducts
        | NavigationTopToken
        | NavigationSpecialModule
      )[]
    }
    link?: {
      label: string
      url: string
    }
    tight: boolean
  }
}

export interface NavigationResponse {
  data: {
    navigation: {
      listOfPanelsCollection: {
        items: {
          label: string
          listsOfLinksCollection: {
            items: {
              title: string
              displayTitle: boolean
              linksListCollection: {
                items: (
                  | NavigationLinkWithNestedLinks
                  | NavigationFeaturedProduct
                  | NavigationTopProducts
                  | NavigationTopToken
                  | NavigationSpecialModule
                )[]
              }
              link?: {
                label: string
                url: string
              }
              tight: boolean
            }[]
          }
        }[]
      }
    }
  }
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
  onMouseEnter(): void
}

export interface NavigationMenuPanelLink {
  icon: unknown
  title: string
  link: string
  hash?: string
  footnote?: ReactNode
}

export interface NavigationMenuPanelIcon {
  icon?: unknown
  image?: string
  tokens?: string[]
  position: 'global' | 'title'
}

export type NavigationMenuPanelListTags = ([string, string] | string)[]

export interface NavigationMenuPanelListItem {
  description?: ReactNode
  hoverColor?: string
  icon?: NavigationMenuPanelIcon
  list?: {
    header?: string
    items: NavigationMenuPanelListItem[]
    link?: {
      label: string
      query?: { [key: string]: string }
      url: string
    }
    tight?: boolean
  }
  navigationModule?: NavigationModule
  promoted?: boolean
  tags?: NavigationMenuPanelListTags
  title: ReactNode
  url?: string
}

export interface NavigationMenuPanelType {
  label: string
  lists: NavigationMenuPanelListItem['list'][]
  url?: string
}
export type NavigationMenuPanelProps = NavigationMenuPanelType & {
  currentPanel?: string
  isPanelOpen: boolean
  onMouseEnter(center: number): void
}

export type NavigationBrandingPillColor = string | [string, string]

export interface NavigationBrandingPill {
  color: NavigationBrandingPillColor
  label: string
}
export interface NavigationProps {
  actions?: ReactNode
  brandingLink?: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
  pill?: NavigationBrandingPill
}

export interface NavigationBrandingProps {
  link?: string
  pill?: NavigationBrandingPill
}
export interface NavigationMenuPanelAsset {
  token: string
  link: string
}

export interface NavigationMenuPanelLink {
  icon: unknown
  title: string
  link: string
  hash?: string
  footnote?: ReactNode
}

export interface NavigationMenuPanelIcon {
  icon?: unknown
  image?: string
  tokens?: string[]
  position: 'global' | 'title'
}

export type NavigationLinkTypes =
  | NavigationLink
  | NavigationLinkWithNestedLinks
  | NavigationFeaturedProduct
  | NavigationTopProducts
  | NavigationTopToken
  | NavigationSpecialModule
