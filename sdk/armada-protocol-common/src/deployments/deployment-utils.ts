import {
  Address,
  ChainIds,
  chainIdToGraphChain,
  getChainInfoByChainId,
  type ChainId,
  type ChainInfo,
  type GraphChain,
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
type ChainKey = GraphChain
type ContractCategoryKey = keyof Config[ChainKey]['deployedContracts']

export const getDeploymentsJsonConfig = (): Config => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isTestDeployment() ? bummerConfig : (sumrConfig as any)
}

const getConfigKey = (chainId: ChainId): ChainKey => {
  return chainIdToGraphChain(chainId)
}

export const getDeploymentConfigContractAddress = <
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
  const config = getDeploymentsJsonConfig()
  const chainInfo = 'chainId' in params ? getChainInfoByChainId(params.chainId) : params.chainInfo
  const configKey = getConfigKey(chainInfo.chainId)
  if (!(configKey in config)) {
    throw new Error(`Chain key ${configKey} is not valid for the current configuration`)
  }

  const contract = config[configKey].deployedContracts[params.contractCategory][
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

export const getAaveV3Address = <
  TKey extends Exclude<ChainKey, 'hyperliquid'>,
  TChainInfo extends ChainInfo,
>(params: {
  chainInfo: TChainInfo
  contractName: keyof Config[Exclude<ChainKey, 'hyperliquid'>]['protocolSpecific']['aaveV3']
}): IAddress => {
  const config = getDeploymentsJsonConfig()
  const configKey = getConfigKey(params.chainInfo.chainId) as TKey

  const address = config[configKey]['protocolSpecific']['aaveV3'][params.contractName]

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
  const config = getDeploymentsJsonConfig()
  const configKey = getConfigKey(params.chainInfo.chainId) as TKey

  if (params.contractName === 'rewards') {
    const address = config[configKey]['protocolSpecific']['compoundV3'][params.contractName]

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
      config[configKey]['protocolSpecific']['compoundV3'][params.contractName][params.token]
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
  const config = getDeploymentsJsonConfig()
  const configKey = getConfigKey(ChainIds.Base)

  const maybeAddress = (
    config[configKey].deployedContracts.gov as { rewardsRedeemer: { address: string | undefined } }
  ).rewardsRedeemer.address
  if (!maybeAddress) {
    throw new Error(
      'Rewards redeemer contract is not available on ' + configKey + '. It is only on Base.',
    )
  }
  return Address.createFromEthereum({ value: maybeAddress })
}

export const getDeployedGovAddress = (
  version: 'rewardsManager' | 'summerStaking' = 'rewardsManager',
) => {
  const config = getDeploymentsJsonConfig()
  const configKey = getConfigKey(ChainIds.Base)

  const maybeAddress = (
    config[configKey].deployedContracts.govV2 as {
      rewardsManager: { address: string | undefined }
      summerStaking: { address: string | undefined }
    }
  )[version].address
  if (!maybeAddress) {
    throw new Error(
      'Gov rewards manager contract is not available on ' + configKey + '. It is only on Base.',
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
  const config = getDeploymentsJsonConfig()
  const configKey = getConfigKey(chainInfo.chainId)
  if (!config[configKey].common) {
    throw new Error(`Common configuration not found for chain: ${chainInfo.name}`)
  }
  if (!config[configKey].common.layerZero) {
    throw new Error(`LayerZero configuration not found for chain: ${chainInfo.name}`)
  }
  const { lzEndpoint, eID } = config[configKey].common.layerZero
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
