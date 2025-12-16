export const sumrMarketCapOptions = ['150000000', '250000000', '500000000', '750000000']
export const [, defaultSumrMarketCap] = sumrMarketCapOptions // default to 250 million
export const getMarketCapIndexByValue = (value?: string) => {
  const index = sumrMarketCapOptions.findIndex((item) => item === value)

  if (index !== -1) {
    return index
  }

  return 1
}
