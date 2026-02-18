export interface DYMProtocolItem {
  name: string
  slug: string
  url?: string
  description?: string
}

export interface DYMSubcategory {
  label: string | null
  items: DYMProtocolItem[]
}

export interface DYMCategory {
  id: string
  title: string
  color: string
  subcategories: DYMSubcategory[]
}
export interface DYMChainItem {
  name: string
  slug: string
}

export interface DYMAssetItem {
  name: string
  sub: string
  slug: string
}

export interface DYMAssetSection {
  label: string
  items: DYMAssetItem[]
}

export interface DYMCuratorItem {
  name: string
}
