import { redirect } from 'next/navigation'

const DelegateRedirectPage = () => {
  redirect('/not-found')
}

export default DelegateRedirectPage
