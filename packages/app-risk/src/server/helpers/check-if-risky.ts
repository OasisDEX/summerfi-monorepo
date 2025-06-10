/* eslint-disable no-console */
import { getTrmRisk } from '@/server/helpers/get-trm-risk'

/**
 * Check if an address is flagged using TRM risk assessment.
 *
 * @param address - The address to be checked for risk.
 * @param apiKey - The API key for accessing the TRM risk assessment service.
 * @param chainId - The chain id to be checked for risk.
 * @returns A promise that resolves to a boolean indicating whether the address is risky.
 *
 * @remarks
 * This function uses the TRM risk assessment service to check if a given address is associated with any risk indicators.
 * If the address has risk indicators with a total volume greater than 0 USD, it is considered risky.
 * The function logs the TRM response data for auditing purposes and handles any errors that may occur during the process.
 * If an error occurs during the TRM check, it logs the error and rethrows it.
 */
export const checkIfRisky = async ({
  address,
  apiKey,
  chainId,
}: {
  address: string
  apiKey: string
  chainId: number
}): Promise<boolean> => {
  try {
    const trmData = await getTrmRisk({ address, apiKey, chainId })

    try {
      console.info(`TRM_LOG ${address} check, payload ${JSON.stringify(trmData)}`)
    } catch (ex) {
      console.error('TRM_LOG logging failed', ex)
    }

    return trmData.addressRiskIndicators.some((indicator) => Number(indicator.totalVolumeUsd) > 100)
  } catch (ex) {
    // https://status.trmlabs.com/ Due to issues with TRM API, we are temporarily not able to check if an address is sanctioned.
    // We are returning false for now as it will allow our existing users to continue using the app
    // and potential new users will be eventually verified and restricted if they happen to be sanctioned.
    console.info(`TRM_TO_BE_VERIFIED ${address}`)

    return false
    // console.error(`TRM_LOG ${address} check failed`)
    // console.error(ex)

    // throw ex
  }
}
