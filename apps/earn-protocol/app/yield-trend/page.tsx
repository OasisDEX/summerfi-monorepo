import { redirect } from 'next/navigation'

import { isPreLaunchVersion } from '@/constants/is-pre-launch-version'
import { YieldTrendView } from '@/features/yield-trend/YieldTrendView'

const YieldTrendPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isPreLaunchVersion) {
    return redirect('/sumr')
  }

  return <YieldTrendView />
}

export default YieldTrendPage
