import { type Metadata } from 'next'

import { WalletMigratePageView } from '@/components/layout/WalletMigratePageView/WalletMigratePageView'

export const metadata: Metadata = {
  title: 'Recover your wallet | Summer.fi',
  description:
    'If you previously signed in with email, Google or a passkey via Account Kit, use this page to export your private key and import it into MetaMask or Rabby.',
}

const WalletMigratePage = () => {
  return <WalletMigratePageView accountKitApiKey={process.env.ACCOUNT_KIT_API_KEY ?? ''} />
}

export default WalletMigratePage
