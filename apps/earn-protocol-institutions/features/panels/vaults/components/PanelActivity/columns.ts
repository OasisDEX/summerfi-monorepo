import { type ActivityTableColumns } from '@/features/panels/vaults/components/PanelActivity/types'

export const activityColumns: {
  key: ActivityTableColumns
  title: string
}[] = [
  {
    key: 'when',
    title: 'When',
  },
  {
    key: 'type',
    title: 'Type',
  },
  {
    key: 'activity',
    title: 'Activity',
  },
]
