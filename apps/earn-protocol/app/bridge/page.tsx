import { redirect } from 'next/navigation'

const BridgeRedirectPage = () => {
  redirect('/not-found')
}

export default BridgeRedirectPage
