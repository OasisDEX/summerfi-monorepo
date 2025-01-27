import { redirect } from 'next/navigation'

import { isPreLaunchVersion } from '@/constants/is-pre-launch-version'

const YieldTrendPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isPreLaunchVersion) {
    return redirect('/sumr')
  }

  return <div>empty page</div>
}

export default YieldTrendPage
