import { ReactNode } from 'react'
import { ProtocolId } from '@summerfi/serverless-shared'

import { FeaturesEnum } from '@/types/generated'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubSupportedNetworks } from '@/types/product-hub'

// types needed for the contentful navigation calls start
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

// types needed for the navigation parser start
export interface NavigationMenuPanelIcon {
  icon?: never
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
