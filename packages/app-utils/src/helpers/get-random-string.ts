/* eslint-disable no-bitwise */

/**
 * Generate a random string using cryptographic random values.
 *
 * @returns A randomly generated string of 32 hexadecimal characters.
 *
 * @remarks
 * This function generates a random 128-bit value, formats it as a UUID-like string,
 * and returns it as a hexadecimal string of length 32.
 */
export function getRandomString(): string {
  let randomString = ''
  let randomValue = ''

  const buffer = crypto.getRandomValues(new Uint8Array(16))

  buffer[6] = (buffer[6] & 0x0f) | 0x40
  buffer[8] = (buffer[8] & 0x3f) | 0x80

  for (let i = 0; i < 16; i++) {
    randomValue = buffer[i].toString(16)
    if (randomValue.length === 1) {
      randomValue = `0${randomValue}`
    }
    randomString += randomValue
  }

  return randomString
}
