import { Address, ChainId, ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { getAddresses } from './get-addresses'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import { Logger } from '@aws-lambda-powertools/logger'
import { getPosition, GetPositionParams } from './get-position'
import { SimulatedPosition, simulatePosition, SimulatePositionParams } from './simulate-position'
import { getTriggerEncoder } from './trigger-encoders'
import {
  PositionLike,
  Price,
  SupportedActions,
  SupportedTriggers,
  SupportedTriggersSchema,
  TriggerData,
  ValidationResults,
} from '~types'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import {
  encodeFunctionForDpm,
  EncodeFunctionForDpmParams,
  TransactionFragment,
} from './encode-function-for-dpm'
import { EncodedFunction } from './trigger-encoders/types'
import type { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import fetch from 'node-fetch'
import memoize from 'just-memoize'
import { getAgainstPositionValidator } from './against-position-validators'
import {
  getRpcGatewayEndpoint,
  IRpcConfig,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { getUsdOraclePrice } from './get-usd-oracle-price'

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

const domainChainIdToViemChain: Record<ChainId, ViemChain> = {
  [ChainId.MAINNET]: mainnet,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.OPTIMISM]: optimism,
  [ChainId.BASE]: base,
  [ChainId.SEPOLIA]: sepolia,
}

export interface ServiceContainer {
  getPosition: (params: GetPositionParams) => Promise<PositionLike>
  simulatePosition: (params: SimulatePositionParams) => SimulatedPosition
  getExecutionPrice: (params: PositionLike) => Price
  validate: (params: {
    position: PositionLike
    executionPrice: Price
    triggerData: TriggerData
    action: SupportedActions
  }) => Promise<ValidationResults>
  getTriggerTxData: (params: {
    position: PositionLike
    triggerData: TriggerData
    action: SupportedActions
  }) => Promise<EncodedFunction>
  encodeForDPM: (params: EncodeFunctionForDpmParams) => TransactionFragment
}

export function buildServiceContainer<
  Trigger extends SupportedTriggers,
  Schema extends SupportedTriggersSchema,
  Protocol extends ProtocolId,
  Chain extends ChainId,
>(
  chainId: Chain,
  protocol: Protocol,
  trigger: Trigger,
  schema: Schema,
  rpcGateway: string,
  getTriggersUrl: string,
  forkRpc?: string,
  logger?: Logger,
): ServiceContainer {
  const rpc = forkRpc ?? getRpcGatewayEndpoint(rpcGateway, chainId, rpcConfig)
  const transport = http(rpc, {
    batch: false,
    fetchOptions: {
      method: 'POST',
    },
  })

  const viemChain: ViemChain = domainChainIdToViemChain[chainId]

  const publicClient: PublicClient = createPublicClient({
    transport,
    chain: viemChain,
  })

  const addresses = getAddresses(chainId)

  const getTriggers = memoize(async (dpm: Address) => {
    try {
      const triggers = await fetch(`${getTriggersUrl}?chainId=${chainId}&dpm=${dpm}`)
      return (await triggers.json()) as GetTriggersResponse
    } catch (e) {
      logger?.error('Error fetching triggers', { error: e })
      throw e
    }
  })

  return {
    getPosition: (params: Parameters<typeof getPosition>[0]) => {
      return getPosition(params, publicClient, addresses, logger)
    },
    simulatePosition: (params: Parameters<typeof simulatePosition>[0]) => {
      return simulatePosition(params, logger)
    },
    getExecutionPrice: (params: Parameters<typeof calculateCollateralPriceInDebtBasedOnLtv>[0]) => {
      return calculateCollateralPriceInDebtBasedOnLtv(params)
    },
    validate: async (params) => {
      const triggers = await getTriggers(params.position.address)
      const validator = getAgainstPositionValidator<Trigger, TriggerData>(trigger)
      const validatorParams: Parameters<typeof validator>[0] = {
        position: params.position,
        executionPrice: params.executionPrice,
        triggerData: params.triggerData,
        action: params.action,
        triggers,
        chainId,
      }
      return validator(validatorParams)
    },
    getTriggerTxData: async ({ position, triggerData, action }) => {
      const triggers = await getTriggers(position.address)

      const debtPriceInUSD = await getUsdOraclePrice(position.debt.token, addresses, publicClient)

      const encodedFunction = getTriggerEncoder({
        position,
        triggers,
        triggerData,
        debtPriceInUSD,
        protocol: ProtocolId.AAVE3,
      })

      if (action === SupportedActions.Add || action === SupportedActions.Update) {
        return {
          encodedTriggerData: encodedFunction.encodedTriggerData,
          txData: encodedFunction.upsertTrigger,
        }
      }

      if (action === SupportedActions.Remove && encodedFunction.removeTrigger) {
        return {
          encodedTriggerData: encodedFunction.encodedTriggerData,
          txData: encodedFunction.removeTrigger,
        }
      }

      throw new Error(`Can't find txData for action ${action}`)
    },
    encodeForDPM: (params: EncodeFunctionForDpmParams) => {
      return encodeFunctionForDpm(params, addresses)
    },
  }
}
