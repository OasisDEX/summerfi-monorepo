'use client'
import { useState } from 'react'
import { Button, Select, Text } from '@summerfi/app-ui'

import { automationItems, ProductCard } from '@/components/molecules/ProductCard/ProductCard'
import { NetworkNames } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'
import { OmniProductType } from '@/types/omni-kit'

import classNames from '@/components/organisms/ProductPicker/ProductPicker.module.scss'

const productTypes = [OmniProductType.Earn, OmniProductType.Borrow, OmniProductType.Multiply]
const networks = [
  NetworkNames.ethereumMainnet,
  NetworkNames.arbitrumMainnet,
  NetworkNames.optimismMainnet,
  NetworkNames.baseMainnet,
]

export const ProductPicker = () => {
  const [productType, setProductType] = useState<OmniProductType>(OmniProductType.Earn)
  const [network, setNetwork] = useState<NetworkNames>(NetworkNames.ethereumMainnet)
  const aaveV3Config = lendingProtocolsByName[LendingProtocol.AaveV3]

  return (
    <div className={classNames.content}>
      <div className={classNames.heading}>
        <div className={classNames.productTypeWrapper}>
          {productTypes.map((type) => (
            <Button variant="unstyled" onClick={() => setProductType(type)}>
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
          onChange={(newNetwork) => setNetwork(newNetwork as NetworkNames)}
          placeholder="All networks"
        />
      </div>

      <div className={classNames.productsWrapper}>
        <ProductCard
          automation={automationItems}
          protocolConfig={aaveV3Config}
          tokens={['ETH', 'DAI']}
          network={NetworkNames.baseMainnet}
          btn={{
            link: '/',
            label: 'Earn xxx Rays for every Automation you add',
          }}
        />
        <ProductCard
          automation={automationItems}
          protocolConfig={aaveV3Config}
          tokens={['ETH', 'DAI']}
          network={NetworkNames.baseMainnet}
          btn={{
            link: '/',
            label: 'Earn xxx Rays for every Automation you add',
          }}
        />
        <ProductCard
          automation={automationItems}
          protocolConfig={aaveV3Config}
          tokens={['ETH', 'DAI']}
          network={NetworkNames.baseMainnet}
          btn={{
            link: '/',
            label: 'Earn xxx Rays for every Automation you add',
          }}
        />
      </div>
    </div>
  )
}
