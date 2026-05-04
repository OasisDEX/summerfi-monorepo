import { type Metadata } from 'next'
import dynamic from 'next/dynamic'

// Loaded client-side only — account-kit creates its own wagmi config internally
// (via @wagmi/core createConfig) and calling it during SSR corrupts Privy/wagmi state.
const WalletMigratePageView = dynamic(
  () =>
    import('@/components/layout/WalletMigratePageView/WalletMigratePageView').then(
      (m) => m.WalletMigratePageView,
    ),
  { ssr: false },
)

export const metadata: Metadata = {
  title: 'Recover your wallet | Summer.fi',
  description:
    'If you previously signed in with email, Google or a passkey via Account Kit, use this page to export your private key and import it into MetaMask or Rabby.',
}

const WalletMigratePage = () => {
  return <WalletMigratePageView accountKitApiKey={process.env.ACCOUNT_KIT_API_KEY ?? ''} />
}

export default WalletMigratePage
