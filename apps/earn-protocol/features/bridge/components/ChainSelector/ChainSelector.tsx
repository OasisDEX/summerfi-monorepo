'use client'
import { Dropdown, Icon, networkIconByNetworkName, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption, SDKNetwork } from '@summerfi/app-types'
import { chainIdToSDKNetwork, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import { type Chain } from 'viem'

import styles from './ChainSelector.module.css'

const networkOptions = Object.entries(networkIconByNetworkName)
  .map(([network, iconName]) => ({
    value: network,
    label: capitalize(sdkNetworkToHumanNetwork(network as SDKNetwork)),
    iconName,
  }))
  .filter(({ value }) =>
    [SDKNetwork.ArbitrumOne, SDKNetwork.Base, SDKNetwork.Mainnet, SDKNetwork.SonicMainnet].includes(
      value as SDKNetwork,
    ),
  )

const NetworkContent: React.FC<{ option: DropdownOption }> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon size={20} tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon size={20} iconName={option.iconName} />}
    <span>{option.label}</span>
  </>
)

interface ChainSelectorProps {
  label: string
  chainId: Chain['id']
  onChange: (network: SDKNetwork) => void
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
        onChange={(selected: DropdownRawOption) => onChange(selected.value as SDKNetwork)}
        asPill
      >
        <NetworkContent option={selectedNetwork} />
      </Dropdown>
    </div>
  )
}
