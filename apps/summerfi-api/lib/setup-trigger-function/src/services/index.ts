import { Address, ChainId, ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { getAddresses } from './get-addresses'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import { Logger } from '@aws-lambda-powertools/logger'
import { getPosition, GetPositionParams } from './get-position'
import { SimulatedPosition, simulatePosition, SimulatePositionParams } from './simulate-position'
import { triggerEncoders } from './trigger-encoders'
import {
  isAaveAutoBuyTriggerData,
  isAaveAutoSellTriggerData,
  PositionLike,
  Price,
  safeParseBigInt,
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
import { CurrentTriggerLike, EncodedFunction } from './trigger-encoders/types'
import type { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import fetch from 'node-fetch'
import memoize from 'just-memoize'
import { getAgainstPositionValidator } from './against-position-validators'
import {
  getRpcGatewayEndpoint,
  IRpcConfig,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'

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
  }) => Promise<ValidationResults>
  encodeTrigger: (position: PositionLike, triggerData: TriggerData) => Promise<EncodedFunction>
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
      const validatorParams = {
        position: params.position,
        executionPrice: params.executionPrice,
        triggerData: params.triggerData,
        triggers,
      }
      return validator(validatorParams)
    },
    encodeTrigger: async (position: PositionLike, triggerData: TriggerData) => {
      const triggers = await getTriggers(position.address)

      try {
        if (isAaveAutoBuyTriggerData(triggerData)) {
          const currentAutoBuy = triggers.triggers.aaveBasicBuy
          const currentTrigger: CurrentTriggerLike | undefined = currentAutoBuy
            ? {
                triggerData: currentAutoBuy.triggerData as `0x${string}`,
                id: safeParseBigInt(currentAutoBuy.triggerId) ?? 0n,
              }
            : undefined
          return triggerEncoders[ProtocolId.AAVE3][SupportedTriggers.AutoBuy](
            position,
            triggerData,
            currentTrigger,
          )
        }
        if (isAaveAutoSellTriggerData(triggerData)) {
          const currentAutoSell = triggers.triggers.aaveBasicSell
          const currentTrigger: CurrentTriggerLike | undefined = currentAutoSell
            ? {
                triggerData: currentAutoSell.triggerData as `0x${string}`,
                id: safeParseBigInt(currentAutoSell.triggerId) ?? 0n,
              }
            : undefined
          return triggerEncoders[ProtocolId.AAVE3][SupportedTriggers.AutoSell](
            position,
            triggerData,
            currentTrigger,
          )
        }
        throw new Error('Unsupported trigger data')
      } catch (e) {
        logger?.error('Error creating triggers', { error: e, position })
        throw e
      }
    },
    encodeForDPM: (params: EncodeFunctionForDpmParams) => {
      return encodeFunctionForDpm(params, addresses)
    },
  }
}
