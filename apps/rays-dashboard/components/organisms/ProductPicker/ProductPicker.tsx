'use client'
import { type FC, useMemo, useState } from 'react'
import {
  type AppRaysConfigType,
  OmniProductType,
  type PortfolioMigrations,
  type ProductHubItem,
  type ProductNetworkConfig,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { Button, Select, Text } from '@summerfi/app-ui'
import { usePathname } from 'next/navigation'

import { ProductCard } from '@/components/molecules/ProductCard/ProductCard'
import { NetworkNames, networksByChainId } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

import productPickerStyles from '@/components/organisms/ProductPicker/ProductPicker.module.scss'

type SupportedNetworks =
  | NetworkNames.ethereumMainnet
  | NetworkNames.arbitrumMainnet
  | NetworkNames.optimismMainnet
  | NetworkNames.baseMainnet

enum MigrateProductType {
  'Migrate' = 'Migrate',
}

enum ProtocolId {
  AAVE3 = 'aave3',
  SPARK = 'spark',
}

const LendingProtocolByProtocolId = {
  [ProtocolId.AAVE3]: LendingProtocol.AaveV3,
  [ProtocolId.SPARK]: LendingProtocol.SparkV3,
}

const networks = [
  NetworkNames.ethereumMainnet,
  NetworkNames.arbitrumMainnet,
  NetworkNames.optimismMainnet,
  NetworkNames.baseMainnet,
]

interface ProductPickerProps {
  products: AppRaysConfigType['products']
  productHub: ProductHubItem[]
  userAddress?: string
  migrations?: PortfolioMigrations['migrationsV2']
}

type ExtendedProductType = OmniProductType | MigrateProductType

const productTypes = [OmniProductType.Earn, OmniProductType.Borrow, OmniProductType.Multiply]

export const ProductPicker: FC<ProductPickerProps> = ({
  products,
  productHub,
  userAddress,
  migrations,
}) => {
  const [productType, setProductType] = useState<ExtendedProductType>(
    migrations?.length ? MigrateProductType.Migrate : OmniProductType.Earn,
  )
  const [network, setNetwork] = useState<SupportedNetworks>(NetworkNames.ethereumMainnet)
  const currentPath = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const items = products[productType as OmniProductType]
    ? products[productType as OmniProductType][network]
    : []

  const mappedItems = items
    .map((item) => {
      const maybePhItem = productHub.find(
        (phItem) =>
          phItem.label.includes(item.label) &&
          phItem.protocol === item.protocol &&
          phItem.network === network &&
          phItem.product.includes(productType as OmniProductType),
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

  const tabsList = useMemo(() => {
    return migrations?.length ? ['Migrate', ...productTypes] : productTypes
  }, [migrations?.length])

  return (
    <div className={productPickerStyles.content}>
      <div className={productPickerStyles.heading}>
        <div className={productPickerStyles.productTypeWrapper}>
          {tabsList.map((type) => (
            <Button
              variant="unstyled"
              onClick={() => setProductType(type as ExtendedProductType)}
              key={type}
            >
              <Text
                as="h5"
                variant="h5"
                style={{
                  color:
                    productType === type ? 'var(--color-primary-100)' : 'var(--color-primary-30)',
                }}
              >
                {type === MigrateProductType.Migrate ? `Migrate (${migrations?.length})` : type}
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

      <div className={productPickerStyles.productsWrapper}>
        {productType !== MigrateProductType.Migrate
          ? mappedItems.map((item) => (
              <ProductCard
                key={item.link}
                automation={item.phItem.automationFeatures ?? []}
                protocolConfig={lendingProtocolsByName[item.phItem.protocol as LendingProtocol]}
                tokens={
                  [
                    ...new Set([item.phItem.primaryToken, item.phItem.secondaryToken]),
                  ] as TokenSymbolsList[]
                }
                title={item.label}
                network={network}
                userAddress={userAddress}
                currentPath={currentPath}
                productType={productType}
                btn={{
                  link: item.link,
                  label:
                    'Earn at least 690 $RAYS for every 10k of value deposited above 10k and boost with added features',
                }}
              />
            ))
          : migrations?.map((migration) => (
              /**
               * Migration link should have following format:
               * [networkOrProduct]/aave/[version]/migrate/[address]
               * @returns string
               */
              <ProductCard
                key={migration.positionAddress}
                automation={[]}
                protocolConfig={
                  lendingProtocolsByName[
                    LendingProtocolByProtocolId[
                      migration.protocolId as keyof typeof LendingProtocolByProtocolId
                    ]
                  ]
                }
                tokens={
                  [
                    ...new Set([migration.collateralAsset.symbol, migration.debtAsset.symbol]),
                  ] as TokenSymbolsList[]
                }
                title={`${migration.collateralAsset.symbol}/${migration.debtAsset.symbol}`}
                network={networksByChainId[migration.chainId].name}
                userAddress={userAddress}
                currentPath={currentPath}
                productType={productType}
                btn={{
                  link: '#',
                  label: 'Testing',
                }}
              />
            ))}
      </div>
    </div>
  )
}
