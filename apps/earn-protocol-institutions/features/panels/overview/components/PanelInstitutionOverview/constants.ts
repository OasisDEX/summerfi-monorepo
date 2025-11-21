import { type TableColumn } from '@summerfi/app-earn-ui'
import dayjs from 'dayjs'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import { type VaultsListTableColumns } from '@/features/panels/overview/components/PanelInstitutionOverview/types'

export const vaultsListColumns: TableColumn<VaultsListTableColumns>[] = [
  {
    key: 'vault',
    title: 'Vault',
  },
  {
    key: 'value',
    title: 'Value',
  },
  {
    key: '30dAPY',
    title: '30d APY',
  },
  {
    key: 'NAV',
    title: 'NAV',
  },
  {
    key: 'action',
    title: '',
  },
]

export const mockedAumChartData = (() => {
  const points = 5 * 24
  const base = Number(Math.random() * 500_000) + 500_000 // base around 500k-1M
  const amplitude = Number(Math.random() * 200_000) + 100_000 // amplitude around 100k-300k
  const smoothFactor = 0.9 // closer to 1 => smoother noise
  const noiseScale = 0.3 // magnitude of random perturbation

  const data = []
  let noise = 0

  for (let i = 0; i < points; i++) {
    // simple smooth noise (low-pass filtered white noise)
    noise = Number(noise * smoothFactor) + Number((Math.random() - 0.5) * noiseScale)

    const value = Math.round(
      base + Number(amplitude * (Number(Math.sin((i / points) * Math.PI * 1.4) * 0.25) + noise)),
    )

    data.push({
      timestamp: dayjs()
        .subtract(points - i, 'hour')
        .format(CHART_TIMESTAMP_FORMAT_DETAILED),
      value,
    })
  }

  return data
})()
