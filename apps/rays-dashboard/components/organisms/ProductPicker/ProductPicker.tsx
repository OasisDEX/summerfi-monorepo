'use client'
import { FC, useState } from 'react'
import { Button, Select, Text, TokenSymbolsList } from '@summerfi/app-ui'

import { ProductCard } from '@/components/molecules/ProductCard/ProductCard'
import { NetworkNames } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { AppRaysConfigType, ProductNetworkConfig } from '@/types/generated/rays-types'
import { OmniProductType } from '@/types/omni-kit'
import { ProductHubItem } from '@/types/product-hub'

import classNames from '@/components/organisms/ProductPicker/ProductPicker.module.scss'

const productTypes = [OmniProductType.Earn, OmniProductType.Borrow, OmniProductType.Multiply]

type SupportedNetworks =
  | NetworkNames.ethereumMainnet
  | NetworkNames.arbitrumMainnet
  | NetworkNames.optimismMainnet
  | NetworkNames.baseMainnet

const networks = [
  NetworkNames.ethereumMainnet,
  NetworkNames.arbitrumMainnet,
  NetworkNames.optimismMainnet,
  NetworkNames.baseMainnet,
]

interface ProductPickerProps {
  products: AppRaysConfigType['products']
  productHub: ProductHubItem[]
}

export const ProductPicker: FC<ProductPickerProps> = ({ products, productHub }) => {
  const [productType, setProductType] = useState<OmniProductType>(OmniProductType.Earn)
  const [network, setNetwork] = useState<SupportedNetworks>(NetworkNames.ethereumMainnet)

  const items = products[productType][network]

  const mappedItems = items
    .map((item) => {
      const maybePhItem = productHub.find(
        (phItem) =>
          phItem.label.includes(item.label) &&
          phItem.protocol === item.protocol &&
          phItem.network === network &&
          phItem.product.includes(productType),
      )

      if (!maybePhItem) {
        return null
      }

      return {
        ...item,
        phItem: maybePhItem,
      }
    })
    .filter((item) => !!item) as (ProductNetworkConfig & { phItem: ProductHubItem })[]

  return (
    <div className={classNames.content}>
      <div className={classNames.heading}>
        <div className={classNames.productTypeWrapper}>
          {productTypes.map((type) => (
            <Button variant="unstyled" onClick={() => setProductType(type)} key={type}>
              <Text
                as="h5"
                variant="h5"
                style={{
                  color:
                    productType === type ? 'var(--color-primary-100)' : 'var(--color-primary-30)',
                }}
              >
                {type}
              </Text>
            </Button>
          ))}
        </div>
        <Select
          options={networks.map((item) => ({ label: item, value: item }))}
          value={network}
          onChange={(newNetwork) => setNetwork(newNetwork as SupportedNetworks)}
          placeholder="All networks"
        />
      </div>

      <div className={classNames.productsWrapper}>
        {mappedItems.map((item) => (
          <ProductCard
            key={item.link}
            automation={item.phItem.automationFeatures || []}
            protocolConfig={lendingProtocolsByName[item.phItem.protocol as LendingProtocol]}
            tokens={
              [
                ...new Set([item.phItem.primaryToken, item.phItem.secondaryToken]),
              ] as TokenSymbolsList[]
            }
            title={item.label}
            network={network}
            btn={{
              link: item.link,
              label: 'Earn xxx Rays for every Automation you add',
            }}
          />
        ))}
      </div>
    </div>
  )
}
