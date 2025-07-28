'use client'
import { Dropdown, Icon, networkNameIconNameMap, Text } from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  SupportedSDKNetworks,
} from '@summerfi/app-types'
import { chainIdToSDKNetwork, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import { type Chain } from 'viem'

import styles from './ChainSelector.module.css'

const networkOptions = Object.entries(networkNameIconNameMap)
  .map(([network, iconName]) => ({
    value: network,
    label: capitalize(sdkNetworkToHumanNetwork(network as SupportedSDKNetworks)),
    iconName,
  }))
  .filter(({ value }) =>
    [
      SupportedSDKNetworks.ArbitrumOne,
      SupportedSDKNetworks.Base,
      SupportedSDKNetworks.Mainnet,
      SupportedSDKNetworks.SonicMainnet,
    ].includes(value as SupportedSDKNetworks),
  )

const NetworkContent: React.FC<{ option: DropdownOption }> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon size={20} tokenName={option.tokenSymbol} />}
    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
    {'iconName' in option && <Icon size={20} iconName={option.iconName ?? 'not_supported_icon'} />}
    <span>{option.label}</span>
  </>
)

interface ChainSelectorProps {
  label: string
  chainId: Chain['id']
  onChange: (network: SupportedSDKNetworks) => void
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ label, chainId, onChange }) => {
  const selectedNetwork =
    networkOptions.find((opt) => opt.value === chainIdToSDKNetwork(chainId)) ?? networkOptions[0]

  return (
    <div className={styles.chainSelector}>
      <Text variant="p3semi" as="label" className={styles.label}>
        {label}
      </Text>
      <Dropdown
        dropdownValue={{
          value: selectedNetwork.value,
          content: <NetworkContent option={selectedNetwork} />,
        }}
        options={networkOptions.map((option) => ({
          value: option.value,
          content: <NetworkContent option={option} />,
        }))}
        onChange={(selected: DropdownRawOption) => onChange(selected.value as SupportedSDKNetworks)}
        asPill
      >
        <NetworkContent option={selectedNetwork} />
      </Dropdown>
    </div>
  )
}
