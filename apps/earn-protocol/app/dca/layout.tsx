import { redirect } from 'next/navigation'

// DCA has been removed from the earn app. Any /dca/* path redirects to the vaults list.
const DCALayout = () => {
  redirect('/')
}

export default DCALayout
