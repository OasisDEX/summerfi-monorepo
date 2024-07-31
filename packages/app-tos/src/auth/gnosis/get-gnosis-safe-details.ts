import type SafeAppsSDK from '@safe-global/safe-apps-sdk'
// eslint-disable-next-line no-duplicate-imports
import { type SignMessageResponse } from '@safe-global/safe-apps-sdk'
import { decode } from 'jsonwebtoken'

import { getDataToSignFromChallenge } from '@/helpers/get-data-to-sign-from-challenge'

const LOCAL_STORAGE_GNOSIS_SAFE_PENDING = 'gnosis-safe-pending'

interface GnosisSafeSignInDetails {
  messageHash: string
  challenge: string
}

interface GnosisSafeSignInDetailsWithData extends GnosisSafeSignInDetails {
  dataToSign: string
}

/**
 * Retrieves or generates Gnosis Safe sign-in details including a message hash and data to sign.
 *
 * @remarks
 * This method checks for a pending signature in local storage. If found and not expired,
 * it uses the existing data. Otherwise, it generates a new signature request and stores the details.
 *
 * @param sdk - The SafeAppsSDK instance used to sign messages.
 * @param chainId - The chain ID of the blockchain network.
 * @param account - The account address for which the details are being retrieved or generated.
 * @param newChallenge - A new challenge string used to generate the data to sign if no pending signature is found.
 *
 * @returns A promise that resolves to an object containing the message hash, challenge, and data to sign.
 *
 * @throws Will throw an error if the response from the SDK is unexpected or if the message hash is not defined.
 */

export const getGnosisSafeDetails = async (
  sdk: SafeAppsSDK,
  chainId: number,
  account: string,
  newChallenge: string,
): Promise<GnosisSafeSignInDetailsWithData> => {
  const key = `${LOCAL_STORAGE_GNOSIS_SAFE_PENDING}/${chainId}-${account}`
  const localStorageItem = localStorage.getItem(key)
  const pendingSignature: GnosisSafeSignInDetails | undefined = localStorageItem
    ? JSON.parse(localStorageItem)
    : undefined

  if (pendingSignature) {
    const exp = (decode(pendingSignature.challenge) as any)?.exp

    if (exp && exp * 1000 >= Date.now()) {
      return {
        ...pendingSignature,
        dataToSign: getDataToSignFromChallenge(pendingSignature.challenge),
      }
    }
  }

  const dataToSign = getDataToSignFromChallenge(newChallenge)
  const res = (await sdk.txs.signMessage(dataToSign)) as SignMessageResponse
  let messageHash: string | undefined

  if ('messageHash' in res) {
    // eslint-disable-next-line prefer-destructuring
    messageHash = res.messageHash
  } else if ('safeTxHash' in res) {
    throw new Error('Please upgrade your SAFE')
  } else {
    throw new Error('Unexpected response type')
  }

  if (!messageHash) {
    throw new Error('Safe messageHash not defined')
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      messageHash,
      challenge: newChallenge,
    } as GnosisSafeSignInDetails),
  )

  return { challenge: newChallenge, messageHash, dataToSign }
}
