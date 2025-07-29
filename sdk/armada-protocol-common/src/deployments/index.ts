import {
  Address,
  ArbitrumChainNames,
  BaseChainNames,
  ChainFamilyName,
  EthereumChainNames,
  getChainInfoByChainId,
  SonicChainNames,
  type ChainId,
  type ChainInfo,
  type IAddress,
} from '@summerfi/sdk-common'
import sumrConfig from './sumr.json'
import bummerConfig from './bummer.json'

let _deployment: 'SUMMER' | 'BUMMER'

export const setTestDeployment = (deployment: string) => {
  switch (deployment) {
    case 'BUMMER':
    case 'SUMMER':
      _deployment = deployment
      break
    default:
      throw new Error('SUMMER_DEPLOYMENT_CONFIG must be set to "SUMMER" or "BUMMER"')
  }
}

export const isTestDeployment = () => {
  switch (_deployment) {
    case 'BUMMER':
      return true
    case 'SUMMER':
      return false
    default:
      throw new Error(
        'Deployment singleton was not initialized. Please call setTestDeployment first.',
      )
  }
}

type Config = typeof bummerConfig
type ChainKey = 'mainnet' | 'base' | 'arbitrum' | 'sonic'
type ContractCategoryKey = keyof Config[ChainKey]['deployedContracts']

const getChainKey = <TName extends string>(name: TName) => {
  const keyMap: Record<ChainInfo['name'], ChainKey> = {
    [EthereumChainNames.Mainnet]: 'mainnet',
    [BaseChainNames.Mainnet]: 'base',
    [ArbitrumChainNames.ArbitrumOne]: 'arbitrum',
    [SonicChainNames.Sonic]: 'sonic',
  }

  const key = keyMap[name]
  if (!key) {
    throw new Error(`Deployment config not found for chain ${name}`)
  }
  return key
}

const getConfig = (): Config => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isTestDeployment() ? bummerConfig : (sumrConfig as any)
}

export const getDeployedContractAddress = <
  TKey extends ChainKey,
  TChainInfo extends ChainInfo,
  TCategory extends ContractCategoryKey,
>(
  params: (
    | {
        chainInfo: TChainInfo
      }
    | { chainId: ChainId }
  ) & {
    contractCategory: TCategory
    contractName: keyof Config[TKey]['deployedContracts'][TCategory]
  },
): IAddress => {
  const config = getConfig()
  const chainInfo = 'chainId' in params ? getChainInfoByChainId(params.chainId) : params.chainInfo
  const chainKey: ChainKey = getChainKey(chainInfo.name)

  const contract = config[chainKey].deployedContracts[params.contractCategory][
    params.contractName
  ] as
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

export const getAaveV3Address = <TKey extends ChainKey, TChainInfo extends ChainInfo>(params: {
  chainInfo: TChainInfo
  contractName: keyof Config[ChainKey]['protocolSpecific']['aaveV3']
}): IAddress => {
  const config = getConfig()
  const chainKey = getChainKey(params.chainInfo.name) as TKey

  const address = config[chainKey]['protocolSpecific']['aaveV3'][params.contractName]

  if (!address) {
    throw new Error(`Contract ${params.contractName.toString()} not found in aaveV3 config`)
  }

  return Address.createFromEthereum({
    value: address,
  })
}

export const getCompoundV3Address = <
  TKey extends 'mainnet' | 'base' | 'arbitrum',
  TChainInfo extends ChainInfo,
>(params: {
  chainInfo: TChainInfo
  contractName: keyof Config['mainnet' | 'base' | 'arbitrum']['protocolSpecific']['compoundV3']
  token?: keyof Config['mainnet' | 'base' | 'arbitrum']['protocolSpecific']['compoundV3']['pools']
}): IAddress => {
  const config = getConfig()
  const chainKey = getChainKey(params.chainInfo.name) as TKey

  if (params.contractName === 'rewards') {
    const address = config[chainKey]['protocolSpecific']['compoundV3'][params.contractName]

    if (!address) {
      throw new Error(`Contract ${params.contractName.toString()} not found in compoundV3 config`)
    }
    return Address.createFromEthereum({
      value: address,
    })
  } else {
    if (!params.token) {
      throw new Error(`Token must be specified for ${params.contractName} contract`)
    }

    const address =
      config[chainKey]['protocolSpecific']['compoundV3'][params.contractName][params.token]
    if (!address) {
      throw new Error(
        `Contract ${params.contractName.toString()} for token ${params.token.toString()} not found in compoundV3 config`,
      )
    }
    return Address.createFromEthereum({
      value: address.cToken,
    })
  }
}

export const getDeployedRewardsRedeemerAddress = () => {
  const config = getConfig()
  const key = getChainKey(ChainFamilyName.Base)

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

export const getDeployedGovRewardsManagerAddress = () => {
  const config = getConfig()
  const key = getChainKey(ChainFamilyName.Base)

  const maybeAddress = (
    config[key].deployedContracts.gov as { rewardsManager: { address: string | undefined } }
  ).rewardsManager.address
  if (!maybeAddress) {
    throw new Error(
      'Gov rewards manager contract is not available on ' + key + '. It is only on Base.',
    )
  }
  return Address.createFromEthereum({ value: maybeAddress })
}

/**
 * Returns the layer zero configuration for the specified chain.
 * This returns the contents of the "layerZero" key from the deployment configuration.
 *
 * @param chainInfo Chain information used to determine the config key
 * @returns The layer zero configuration object for the given chain.
 * @throws Error if the layer zero field is not defined for this chain.
 */
export const getLayerZeroConfig = (
  chainInfo: ChainInfo,
): {
  lzEndpoint: IAddress
  eID: number
} => {
  const config = getConfig()
  const key = getChainKey(chainInfo.name)
  if (!config[key].common) {
    throw new Error(`Common configuration not found for chain: ${chainInfo.name}`)
  }
  if (!config[key].common.layerZero) {
    throw new Error(`LayerZero configuration not found for chain: ${chainInfo.name}`)
  }
  const { lzEndpoint, eID } = config[key].common.layerZero
  if (!lzEndpoint) {
    throw new Error(`LayerZero endpoint address not found for chain: ${chainInfo.name}`)
  }
  if (!eID) {
    throw new Error(`LayerZero endpoint ID not found for chain: ${chainInfo.name}`)
  }
  return {
    lzEndpoint: Address.createFromEthereum({ value: lzEndpoint }),
    eID: parseInt(eID),
  }
}
