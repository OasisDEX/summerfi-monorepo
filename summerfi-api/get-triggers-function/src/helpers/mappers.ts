import type { TriggersQuery } from '@summerfi/automation-subgraph'
import { getTriggerPoolId } from './get-trigger-pool-id'
import BigNumber from 'bignumber.js'
import { maxUnit256 } from '@summerfi/triggers-shared'
import { getMakerInfo } from './get-maker-info'

const one = new BigNumber(1)
const ten = new BigNumber(10)

export const mapTriggerCommonParams = (trigger: TriggersQuery['triggers'][number]) => ({
  triggerId: trigger.id,
  triggerData: trigger.triggerData,
})

const mapMakerTriggerCommonParams = (trigger: TriggersQuery['triggers'][number]) => ({
  cdpId: trigger.decodedData[trigger.decodedDataNames.indexOf('cdpId')],
  triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
})

const mapMakerBuySellTriggerCommonParams = ({
  decodedData,
  decodedDataNames,
  account,
  triggerType,
  cdp,
  tokens,
  ...rest
}: TriggersQuery['triggers'][number]) => {
  const execCollRatio = decodedData[decodedDataNames.indexOf('execCollRatio')]
  const targetCollRatio = decodedData[decodedDataNames.indexOf('targetCollRatio')]
  const collateralToken = cdp!.collateralToken.address
  const debtToken = tokens.filter(
    // tokens has a list of both used tokens, i could just use DAI always, but this is more robust
    (token) => token.address.toLowerCase() !== collateralToken.toLowerCase(),
  )[0].address
  // executionLtv is minimum 4 digits with an implied decimal point in the middle
  const executionLtv = BigNumber(BigNumber(10).pow(2)) // execCollRatio and targetCollRatio is in
    //percentage with two right-padded zeroes (e.g. 32000 is 320%)
    .div(BigNumber(execCollRatio).dividedBy(100).toString()) // down to 1.5
    .times(BigNumber(10).pow(4))
    .toFixed(0) // to 1500
  const targetLtv = BigNumber(BigNumber(10).pow(2))
    .div(BigNumber(targetCollRatio).dividedBy(100).toString()) // down to 1.5
    .times(BigNumber(10).pow(4))
    .toFixed(0) // to 1500
  return {
    ...mapMakerTriggerCommonParams({
      decodedData,
      decodedDataNames,
      account,
      triggerType,
      cdp,
      tokens,
      ...rest,
    }),
    positionAddress: account as string,
    triggerType: String(triggerType),
    maxCoverage: '15000000000', // ??
    executionLtv: executionLtv.padStart(4, '0'),
    targetLtv: targetLtv.padStart(4, '0'),
    debtToken,
    collateralToken,
    operationName: '',
    deviation: decodedData[decodedDataNames.indexOf('deviation')],
    maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
    continuous: decodedData[decodedDataNames.indexOf('continuous')] === 'true',
  }
}

export const mapMakerDecodedStopLossParams = ({
  decodedData,
  decodedDataNames,
  account,
  triggerType,
  cdp,
  tokens,
  ...rest
}: TriggersQuery['triggers'][number]) => {
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
    ...mapMakerTriggerCommonParams({
      decodedData,
      decodedDataNames,
      account,
      triggerType,
      cdp,
      tokens,
      ...rest,
    }),
    collRatio: collateralizationRatio,
    positionAddress: account as string,
    triggerType: String(triggerType),
    debtToken,
    collateralToken,
    executionLtv: executionLtv.padStart(4, '0'),
    // copied from oasis-borrow:
    // equals to 1500 USDC, this is the max amount user will pay for the trigger
    // to be executed, in practice it will be way lower than this
    maxCoverage: '15000000000', // ??
    operationName: '',
  }
}

const parseMaxBuyPrice = (maxBuyPrice: string) => {
  const parsedMaxBuyPrice = new BigNumber(maxBuyPrice)
  if (
    parsedMaxBuyPrice.isNaN() ||
    parsedMaxBuyPrice.isEqualTo(new BigNumber(maxUnit256.toString()))
  ) {
    return new BigNumber(maxUnit256.toString()).toString()
  }
  return parsedMaxBuyPrice.div(ten.pow(10)).toString()
}

const parseMinSellPrice = (minSellPrice: string) => {
  const parsedMinSellPrice = new BigNumber(minSellPrice)
  if (parsedMinSellPrice.isNaN() || parsedMinSellPrice.isEqualTo(0)) {
    return new BigNumber(maxUnit256.toString()).toString()
  }
  return parsedMinSellPrice.div(ten.pow(10)).toString()
}

export const mapMakerDecodedBasicBuyParams = (trigger: TriggersQuery['triggers'][number]) => ({
  ...mapMakerBuySellTriggerCommonParams(trigger),
  maxBuyPrice: parseMaxBuyPrice(
    trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')],
  ),
})

export const mapMakerDecodedBasicSellParams = (trigger: TriggersQuery['triggers'][number]) => ({
  ...mapMakerBuySellTriggerCommonParams(trigger),
  minSellPrice: parseMinSellPrice(
    trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')],
  ),
})

export const mapMakerDecodedAutoTakeProfitParams = (
  trigger: TriggersQuery['triggers'][number],
  makerPositionInfo?: Awaited<ReturnType<typeof getMakerInfo>>,
) => {
  const { decodedData, decodedDataNames, cdp } = trigger
  const executionPriceParsed = new BigNumber(
    decodedData[decodedDataNames.indexOf('executionPrice')],
  ).div(ten.pow(Number(cdp!.collateralToken.decimals)))
  const hasDebt = !makerPositionInfo!.debtInUsd.isZero()
  return {
    ...mapMakerTriggerCommonParams(trigger),
    executionPrice: decodedData[decodedDataNames.indexOf('executionPrice')],
    maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
    currentLtv: hasDebt
      ? one
          .div(makerPositionInfo!.collateralInUSD.div(makerPositionInfo!.debtInUsd))
          .times(ten.pow(4))
          .toFixed(0)
      : '0',
    executionLtv: hasDebt
      ? one
          .div(
            makerPositionInfo!.collateralAmount
              .times(executionPriceParsed)
              .div(makerPositionInfo!.debtInUsd),
          )
          .times(ten.pow(4))
          .toFixed(0)
      : '0',
  }
}

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
