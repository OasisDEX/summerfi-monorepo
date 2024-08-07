import { ReactNode } from 'react'
import { LendingProtocol } from '../lending-protocol'
import { ProductHubSupportedNetworks } from '../product-hub'
import { OmniProductType } from '../omni-kit'
import {
  NavigationMenuPanelIcon,
  NavigationMenuPanelListTags,
  NavigationModule,
} from '../components'
import { FeaturesEnum } from '../generated/main-config'

// types needed for the contentful navigation calls start

interface NavigationLink {
  __typename: 'NavigationLink'
  description: string
  featureFlag?: FeaturesEnum
  label: string
  link?: string
  protocol?: {
    slug: LendingProtocol
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
    slug: LendingProtocol
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

export interface NavigationMenuPanelListItem {
  description?: ReactNode
  protocolName?: string
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

export type NavigationLinkTypes =
  | NavigationLink
  | NavigationLinkWithNestedLinks
  | NavigationFeaturedProduct
  | NavigationTopProducts
  | NavigationTopToken
  | NavigationSpecialModule
