import {
  Address,
  ArbitrumChainNames,
  BaseChainNames,
  ChainFamilyName,
  EthereumChainNames,
  type ChainInfo,
  type IAddress,
} from '@summerfi/sdk-common'
import config from './config.json'

type Config = typeof config
type ConfigKey = 'mainnet' | 'base' | 'arbitrum'
type CategoryKey = keyof Config[ConfigKey]['deployedContracts']

const getConfigKey = <TName extends string>(name: TName) => {
  const keyMap: Record<ChainInfo['name'], ConfigKey> = {
    [EthereumChainNames.Mainnet]: 'mainnet',
    [BaseChainNames.Mainnet]: 'base',
    [ArbitrumChainNames.ArbitrumOne]: 'arbitrum',
  }

  const key = keyMap[name]
  if (!key) {
    throw new Error(`Deployment config not found for chain ${name}`)
  }
  return key
}

export const getDeployedContractAddress = <
  TKey extends ConfigKey,
  TChainInfo extends ChainInfo,
  TCategory extends CategoryKey,
>(params: {
  chainInfo: TChainInfo
  contractCategory: TCategory
  contractName: keyof Config[TKey]['deployedContracts'][TCategory]
}): IAddress => {
  const key = getConfigKey(params.chainInfo.name) as TKey

  const contract = config[key].deployedContracts[params.contractCategory][params.contractName] as
    | {
        address: string
      }
    | undefined

  if (!contract?.address) {
    throw new Error(
      `Contract ${params.contractName.toString()} in category ${params.contractCategory.toString()} not found in deployment config`,
    )
  }

  return Address.createFromEthereum({
    value: contract.address,
  })
}

export const getDeployedRewardsRedeemerAddress = () => {
  const key = getConfigKey(ChainFamilyName.Base)
  const maybeAddress = (
    config[key].deployedContracts.gov as { rewardsRedeemer: { address: string | undefined } }
  ).rewardsRedeemer.address
  if (!maybeAddress) {
    throw new Error(
      'Rewards redeemer contract is not available on ' + key + '. It is only on Base.',
    )
  }
  return Address.createFromEthereum({ value: maybeAddress })
}
