export const getInstitutionData = async (institutionId: string) => {
  // get the 'global' institution data here
  // this is a mock implementation, replace with actual data fetching logic

  if (!institutionId) {
    throw new Error('Institution ID is required')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  }) // Simulate network delay

  return {
    id: 'acme-crypto-corp',
    name: 'ACME Crypto Corp.',
    totalValue: 2225000000,
    numberOfVaults: 4,
    thirtyDayAvgApy: 0.078,
    allTimePerformance: 0.0112,
    vaultData: {
      name: 'USDC-1',
      asset: 'USDC',
      nav: 1.153,
      aum: 1792000000,
      fee: 0.005,
      inception: 1735689600000,
    },
  }
}
