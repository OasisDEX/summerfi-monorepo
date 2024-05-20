import type { TriggersQuery } from '@summerfi/automation-subgraph'

/**
 * @param trigger - trigger object from automation subgraph response
 *
 * @returns collateral and debt token basic data
 */
export const getTokensFromTrigger = (trigger: TriggersQuery['triggers'][0]) => {
  const debtAddressIndex = trigger.decodedDataNames.findIndex((x) => x === 'debtToken')
  let debtAddress = ''
  let debtToken
  if (debtAddressIndex != -1) {
    debtAddress = trigger.decodedData[debtAddressIndex]
    debtToken = trigger.tokens.find((x) => x.address.toLowerCase() === debtAddress.toLowerCase())
  }

  const collateralAddressIndex = trigger.decodedDataNames.findIndex((x) => x === 'collateralToken')
  let collateralAddress = ''
  let collateralToken
  if (collateralAddressIndex != -1) {
    collateralAddress = trigger.decodedData[collateralAddressIndex]
    collateralToken = trigger.tokens.find(
      (x) => x.address.toLowerCase() === collateralAddress.toLowerCase(),
    )
  }
  return { collateralToken, debtToken }
}
