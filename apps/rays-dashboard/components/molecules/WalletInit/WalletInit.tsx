import dynamic from 'next/dynamic'

export const WalletInit = dynamic(() => import('@/components/molecules/WalletInit/WalletInitProxy'))
