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
      'Approve or offboard markets, ensuring only the best and safest yield opportunities are available.',
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
    description:
      'Decide on how to spend revenue, allocate $SUMR token rewards and issue grants to balance growth with long term sustainability.',
  },
]

export const sumrStakeToDelegate: SumrGovernListData = [
  {
    iconName: 'plant_colorful',
    title: 'Stake, Delegate and Earn on your $SUMR',
    description:
      'When you stake and delegate your $SUMR, you won’t only be protecting the Lazy Summer Protocol, you will be earning additional $SUMR.',
  },
  {
    iconName: 'checkmark_cookie_colorful',
    title: 'Always ensure you’re delegating to an active delegate',
    description:
      'Choosing who you delegate to may impact the voting power you are assigning and also the rewards you can earn. Each delegate has a voting power decay factor, which drops if they miss votes or stop participating in governance. The higher their decay, the more you earn. So stay on top of your delegate and ensure you’re always delegating to an active delegate. ',
  },
]
