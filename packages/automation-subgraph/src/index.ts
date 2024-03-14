import { request } from 'graphql-request'
import {
  OneTriggerDocument,
  OneTriggerQuery,
  TriggersDocument,
  TriggersQuery,
} from './types/graphql/generated'
import { ChainId } from '@summerfi/serverless-shared/domain-types'
import { Logger } from '@aws-lambda-powertools/logger'

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.MAINNET]: 'summer-automation',
  [ChainId.BASE]: 'summer-automation-base',
  [ChainId.OPTIMISM]: 'summer-automation-optimism',
  [ChainId.ARBITRUM]: 'summer-automation-arbitrum',
}

const getEndpoint = (chainId: ChainId, baseUrl: string) => {
  const subgraph = chainIdSubgraphMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph for chainId ${chainId}`)
  }
  return `${baseUrl}/${subgraph}`
}
interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
  logger?: Logger
}

export interface GetTriggersParams {
  dpm: string
}

export interface GetOneTriggerParams {
  triggerId: string
}

export type OneTrigger = Required<OneTriggerQuery['trigger']>

export type GetTriggers = (params: GetTriggersParams) => Promise<TriggersQuery>

export type GetOneTrigger = (params: GetOneTriggerParams) => Promise<OneTrigger | null>

async function getTriggers(params: GetTriggersParams, config: SubgraphClientConfig) {
  const url = getEndpoint(config.chainId, config.urlBase)
  const triggers = await request(url, TriggersDocument, {
    dpm: params.dpm,
  })

  config.logger?.debug('Received triggers for account', { account: params.dpm, triggers })

  return triggers
}

async function getOneTrigger(params: GetOneTriggerParams, config: SubgraphClientConfig) {
  const url = getEndpoint(config.chainId, config.urlBase)
  const result = await request(url, OneTriggerDocument, {
    triggerId: params.triggerId,
  })

  return result.trigger
}

export interface AutomationSubgraphClient {
  getTriggers: GetTriggers
  getOneTrigger: GetOneTrigger
}

export function getAutomationSubgraphClient(
  config: SubgraphClientConfig,
): AutomationSubgraphClient {
  return {
    getTriggers: (params: GetTriggersParams) => getTriggers(params, config),
    getOneTrigger: (params: GetOneTriggerParams) => getOneTrigger(params, config),
  }
}
export type { TriggersQuery } from './types/graphql/generated'
