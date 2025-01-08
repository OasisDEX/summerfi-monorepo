import { redirect } from 'next/navigation'

export const revalidate = 60

const StakeDelegateRedirectPage = () => {
  redirect(`/earn`)
}

export default StakeDelegateRedirectPage
