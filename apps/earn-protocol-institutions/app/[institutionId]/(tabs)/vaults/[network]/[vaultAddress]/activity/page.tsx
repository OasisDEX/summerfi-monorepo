import { PanelActivity } from '@/features/panels/vaults/components/PanelActivity/PanelActivity'
import {
  type InstitutionVaultActivityItem,
  InstitutionVaultActivityType,
} from '@/types/institution-data'

const dummyActivitiesData: InstitutionVaultActivityItem[] = [
  {
    when: '2021-01-05',
    type: InstitutionVaultActivityType.DEPOSIT,
    message: 'A message here tp explain the type of activity that has taken place',
  },
  {
    when: '2021-01-04',
    type: InstitutionVaultActivityType.WITHDRAWAL,
    message: 'A message here tp explain the type of activity that has taken place',
  },
  {
    when: '2021-01-03',
    type: InstitutionVaultActivityType.REBALANCE,
    message: 'A message here tp explain the type of activity that has taken place',
  },
  {
    when: '2021-01-02',
    type: InstitutionVaultActivityType.USER_ADDED,
    message: '-',
  },
  {
    when: '2021-01-01',
    type: InstitutionVaultActivityType.USER_REMOVED,
    message: '-',
  },
]

export default async function InstitutionVaultActivityPage() {
  // simulate loading state
  // eslint-disable-next-line no-promise-executor-return
  const _dummy: InstitutionVaultActivityItem[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyActivitiesData)
    }, 1000)
  }) // Simulate loading delay

  return <PanelActivity activitiesData={_dummy} />
}
