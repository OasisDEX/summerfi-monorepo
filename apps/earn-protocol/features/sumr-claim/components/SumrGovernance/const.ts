import { type IconNamesList } from '@summerfi/app-earn-ui'

type SumrGovernListData = {
  iconName: IconNamesList
  title: string
  description: string
}[]

export const sumrGovernLazySummerData: SumrGovernListData = [
  {
    iconName: 'plant_colorful',
    title: 'Curate the best of Defi',
    description:
      'Approve or off board markets, ensuring only the best and safest yield opportunities are available.',
  },
  {
    iconName: 'checkmark_cookie_colorful',
    title: 'Keep contributors accountable',
    description:
      'Monitor and hold third-party contributors (Risk Curators) accountable, ensuring consistent, responsible protocol management.',
  },
  {
    iconName: 'migrate_colorful',
    title: 'Allocate Protocol Captial',
    description: 'Influence revenue allocations to balance growth',
  },
]

export const sumrStakeToDelegate: SumrGovernListData = [
  {
    iconName: 'plant_colorful',
    title: 'Stake for 2.6%',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    iconName: 'checkmark_cookie_colorful',
    title: 'Delegate decision making',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]
