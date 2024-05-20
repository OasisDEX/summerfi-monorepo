import type { TriggersQuery } from '@summerfi/automation-subgraph'

/**
 * @param trigger - trigger object from automation subgraph response
 *
 * @returns collateral and debt token basic data
 */
export const getTokensFromTrigger = (trigger: TriggersQuery['triggers'][0]) => {
  let debtToken
  const debtAddressIndex = trigger.decodedDataNames.findIndex((x) => x === 'debtToken')
  if (debtAddressIndex != -1) {
    const debtAddress = trigger.decodedData[debtAddressIndex]
    debtToken = trigger.tokens.find((x) => x.address.toLowerCase() === debtAddress.toLowerCase())
  }

  let collateralToken
  const collateralAddressIndex = trigger.decodedDataNames.findIndex((x) => x === 'collateralToken')
  if (collateralAddressIndex != -1) {
    const collateralAddress = trigger.decodedData[collateralAddressIndex]
    collateralToken = trigger.tokens.find(
      (x) => x.address.toLowerCase() === collateralAddress.toLowerCase(),
    )
  }

  return { collateralToken, debtToken }
}
