import { redirect } from 'next/navigation'

import { InstitutionPageView } from '@/components/layout/InstitutionPageView/InstitutionPageView'

// dummy interface for now
// we will most likely split it depends on data source
const mockInstitutions = [
  {
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
  },
]

const InstitutionPage = async ({ params }: { params: { institutionId: string } }) => {
  const { institutionId } = await params

  const institution = mockInstitutions.find((item) => item.id === institutionId)

  if (!institution) {
    return redirect('/not-found')
  }

  return (
    <InstitutionPageView
      institutionName={institution.name}
      totalValue={institution.totalValue}
      numberOfVaults={institution.numberOfVaults}
      thirtyDayAvgApy={institution.thirtyDayAvgApy}
      allTimePerformance={institution.allTimePerformance}
      vaultData={institution.vaultData}
    />
  )
}

export default InstitutionPage
