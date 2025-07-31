'use client'
import { createContext, type FC, type ReactNode, useContext } from 'react'

import { type InstitutionDataBasic } from '@/types/institution-data'
import { type WalletData } from '@/types/wallet-data'

const InstitutionContext = createContext<
  | {
      walletData?: WalletData
      institution?: InstitutionDataBasic
    }
  | undefined
>(undefined)

export const InstitutionProvider: FC<{
  value?: {
    walletData?: WalletData
    institution?: InstitutionDataBasic
  }
  children: ReactNode
}> = ({ value, children }) => {
  return <InstitutionContext.Provider value={value}>{children}</InstitutionContext.Provider>
}

/**
 * Hook to access the system configuration context
 * @returns Partial<EarnAppConfigType> - The system configuration object, or an empty object if context is not available
 */

export const useInstitution = () => {
  const institutionContextData = useContext(InstitutionContext)

  return institutionContextData
}
