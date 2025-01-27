import { redirect } from 'next/navigation'

import { isFullyLaunched } from '@/constants/is-fully-launched'

const YieldTrendPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!isFullyLaunched) {
    return redirect('/sumr')
  }

  return <div>empty page</div>
}

export default YieldTrendPage
