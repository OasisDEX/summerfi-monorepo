import { type TableColumn } from '@summerfi/app-earn-ui'

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
    title: '',
  },
]
