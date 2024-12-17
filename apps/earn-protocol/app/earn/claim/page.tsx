import { redirect } from 'next/navigation'

export const revalidate = 60

const ClaimRedirectPage = () => {
  redirect(`/earn`)
}

export default ClaimRedirectPage
