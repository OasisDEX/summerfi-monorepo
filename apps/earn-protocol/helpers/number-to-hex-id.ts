export const numberToHexId = (number: number | string) => {
  return `0x${Number(number).toString(16)}`
}
