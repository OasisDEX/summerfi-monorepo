import { Address, ChainFamilyName, type ChainInfo, type IAddress } from '@summerfi/sdk-common'
import config from './index.json'

type ConfigKey = 'mainnet' | 'base' | 'arbitrum'

const getConfigKey = <TName extends string>(name: TName) => {
  const keyMap: Record<ChainInfo['name'], ConfigKey> = {
    [ChainFamilyName.Ethereum]: 'mainnet',
    [ChainFamilyName.Base]: 'base',
    [ChainFamilyName.Arbitrum]: 'arbitrum',
  }

  const key = keyMap[name]
  if (!key) {
    throw new Error(`Deployment config not found for chain ${name}`)
  }
  return key
}

export const getDeployedContractAddress = <
  TKey extends ConfigKey,
  TCategory extends keyof (typeof config)[TKey]['deployedContracts'],
>(params: {
  chainInfo: ChainInfo
  contractCategory: TCategory
  contractName: keyof (typeof config)[TKey]['deployedContracts'][TCategory]
}): IAddress => {
  const key = getConfigKey(params.chainInfo.name) as TKey

  const contractAddress = config[key].deployedContracts[params.contractCategory]

  if (!contractAddress) {
    throw new Error(
      `Contract ${params.contractName.toString()} in category ${params.contractCategory.toString()} not found in deployment config`,
    )
  }

  return Address.createFromEthereum({
    value: contractAddress,
  })
}
