export type InstitutionData = {
  id: string
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
  vaultData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
  }
}

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  institutionName: InstitutionData['institutionName']
}
