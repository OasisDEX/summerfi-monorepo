import type { AddressValue } from './AddressValue'

/**
 * @name EarnAppCookieVerifier
 * @description Callback that verifies a request is authorized for the given user address.
 * Should throw an error if the verification fails.
 */
export type EarnAppCookieVerifier = (userAddress: AddressValue) => Promise<void>
