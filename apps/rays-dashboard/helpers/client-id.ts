/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-bitwise */
/* eslint-disable no-magic-numbers */

export function getRandomString() {
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

export const clientId = getRandomString() + getRandomString()
