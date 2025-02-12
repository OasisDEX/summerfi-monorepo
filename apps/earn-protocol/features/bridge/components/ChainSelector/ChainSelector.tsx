'use client'
import { Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption, SDKNetwork } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { networkIconByNetworkName } from '@/constants/networkIcons'

import styles from './ChainSelector.module.scss'

const networkOptions = Object.entries(networkIconByNetworkName)
  .map(([network, iconName]) => ({
    value: network,
    label: capitalize(sdkNetworkToHumanNetwork(network as SDKNetwork)),
    iconName,
  }))
  .filter(({ value }) =>
    [SDKNetwork.ArbitrumOne, SDKNetwork.Base, SDKNetwork.Mainnet].includes(value),
  )

const NetworkContent: React.FC<{ option: DropdownOption }> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon iconName={option.iconName} />}
    <span>{option.label}</span>
  </>
)

interface ChainSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ label, value, onChange }) => {
  const selectedNetwork = networkOptions.find((opt) => opt.value === value) || networkOptions[0]

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
        onChange={(selected: DropdownRawOption) => onChange(selected.value)}
        asPill
        // className={styles.dropdown}
      >
        <NetworkContent option={selectedNetwork} />
      </Dropdown>
    </div>
  )
}

export default ChainSelector
