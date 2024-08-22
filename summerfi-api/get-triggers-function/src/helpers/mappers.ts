import type { TriggersQuery } from '@summerfi/automation-subgraph'
import { getTriggerPoolId } from './get-trigger-pool-id'
import BigNumber from 'bignumber.js'
import { getMakerPositionInfo } from './get-maker-position-info'

export const mapTriggerCommonParams = (trigger: TriggersQuery['triggers'][number]) => ({
  triggerId: trigger.id,
  triggerData: trigger.triggerData,
})

const mapMakerTriggerCommonParams = ({
  decodedData,
  decodedDataNames,
}: {
  decodedData: readonly string[]
  decodedDataNames: readonly string[]
}) => ({
  cdpId: decodedData[decodedDataNames.indexOf('cdpId')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
})

const mapMakerBuySellTriggerCommonParams = ({
  decodedData,
  decodedDataNames,
}: {
  decodedData: readonly string[]
  decodedDataNames: readonly string[]
}) => ({
  ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
  execCollRatio: decodedData[decodedDataNames.indexOf('execCollRatio')],
  targetCollRatio: decodedData[decodedDataNames.indexOf('targetCollRatio')],
  continuous: decodedData[decodedDataNames.indexOf('continuous')] === 'true',
  deviation: decodedData[decodedDataNames.indexOf('deviation')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapMakerDecodedStopLossParams = (
  {
    decodedData,
    decodedDataNames,
    account,
    triggerType,
    cdp,
    tokens,
  }: TriggersQuery['triggers'][number],
  makerPositionInfo?: Awaited<ReturnType<typeof getMakerPositionInfo>>,
) => {
  const collateralizationRatio = decodedData[decodedDataNames.indexOf('collRatio')]
  const collateralToken = cdp!.collateralToken.address
  const debtToken = tokens.filter(
    // tokens has a list of both used tokens, i could just use DAI always, but this is more robust
    (token) => token.address.toLowerCase() !== collateralToken.toLowerCase(),
  )[0].address
  // executionLtv is minimum 4 digits with an implied decimal point in the middle
  const executionLtv = BigNumber(100) // collRatio is in percentage (e.g. 150)
    .div(BigNumber(collateralizationRatio).dividedBy(100).toString()) // down to 1.5
    .times(BigNumber(10).pow(2))
    .toFixed(0) // to 1500
  return {
    ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
    collRatio: collateralizationRatio,
    positionAddress: account as string,
    triggerType: String(triggerType),
    debtToken,
    collateralToken,
    executionLtv,
    // copied from oasis-borrow:
    // equals to 1500 USDC, this is the max amount user will pay for the trigger
    // to be executed, in practice it will be way lower than this
    maxCoverage: '15000000000', // ??
    operationName: '',
    // ltv is added in the advanced triggers (its async)
    // ltv: decodedData[decodedDataNames.indexOf('ltv')],
  }
}

export const mapMakerDecodedBasicBuyParams = (
  { decodedData, decodedDataNames }: TriggersQuery['triggers'][number],
  makerPositionInfo?: Awaited<ReturnType<typeof getMakerPositionInfo>>,
) => ({
  ...mapMakerBuySellTriggerCommonParams({ decodedData, decodedDataNames }),
  maxBuyPrice: decodedData[decodedDataNames.indexOf('maxBuyPrice')],
})

export const mapMakerDecodedBasicSellParams = (
  { decodedData, decodedDataNames }: TriggersQuery['triggers'][number],
  makerPositionInfo?: Awaited<ReturnType<typeof getMakerPositionInfo>>,
) => ({
  ...mapMakerBuySellTriggerCommonParams({ decodedData, decodedDataNames }),
  minSellPrice: decodedData[decodedDataNames.indexOf('minSellPrice')],
})

export const mapMakerDecodedAutoTakeProfitParams = (
  { decodedData, decodedDataNames }: TriggersQuery['triggers'][number],
  makerPositionInfo?: Awaited<ReturnType<typeof getMakerPositionInfo>>,
) => ({
  ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
  executionPrice: decodedData[decodedDataNames.indexOf('executionPrice')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapStopLossParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  positionAddress: decodedData[decodedDataNames.indexOf('positionAddress')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
  maxCoverage: decodedData[decodedDataNames.indexOf('maxCoverage')],
  executionLtv: decodedData[decodedDataNames.indexOf('executionLtv')],
  debtToken: decodedData[decodedDataNames.indexOf('debtToken')],
  collateralToken: decodedData[decodedDataNames.indexOf('collateralToken')],
  ltv: decodedData[decodedDataNames.indexOf('ltv')],
  operationName: decodedData[decodedDataNames.indexOf('operationName')],
})

export const mapBuySellCommonParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  positionAddress: decodedData[decodedDataNames.indexOf('positionAddress')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
  maxCoverage: decodedData[decodedDataNames.indexOf('maxCoverage')],
  debtToken: decodedData[decodedDataNames.indexOf('debtToken')],
  collateralToken: decodedData[decodedDataNames.indexOf('collateralToken')],
  operationName: decodedData[decodedDataNames.indexOf('operationName')],
  executionLtv:
    decodedData[
      Math.max(decodedDataNames.indexOf('execLtv'), decodedDataNames.indexOf('executionLtv'))
    ],
  targetLtv: decodedData[decodedDataNames.indexOf('targetLtv')],
  deviation: decodedData[decodedDataNames.indexOf('deviation')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapTriggersWithSamePoolId = ({
  poolId,
  trigger,
}: {
  poolId: string
  trigger: TriggersQuery['triggers'][number]
}) => {
  const poolIdFromTrigger = getTriggerPoolId(trigger)

  return poolIdFromTrigger?.toLowerCase() === poolId?.toLowerCase()
}
