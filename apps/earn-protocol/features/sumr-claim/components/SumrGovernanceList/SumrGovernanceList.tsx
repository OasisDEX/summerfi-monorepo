import { type FC } from 'react'
import { type IconNamesList, IconWithBackground, Text } from '@summerfi/app-earn-ui'

import classNames from './SumrGovernanceList.module.css'

interface SumrGovernanceListProps {
  list: { iconName: IconNamesList; title: string; description: string }[]
}

export const SumrGovernanceList: FC<SumrGovernanceListProps> = ({ list }) => {
  return (
    <div className={classNames.sumrGovernanceListWrapper}>
      {list.map((item) => (
        <div className={classNames.sumrGovernanceContentWrapper} key={item.title}>
          <IconWithBackground iconName={item.iconName} backgroundSize={64} />
          <div className={classNames.sumrGovernanceListTextual}>
            <Text as="h5" variant="h5">
              {item.title}
            </Text>
            <Text as="p" variant="p2">
              {item.description}
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}
