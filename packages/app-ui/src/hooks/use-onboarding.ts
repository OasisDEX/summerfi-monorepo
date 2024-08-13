'use client'
import { useLocalStorage } from '@/hooks/use-local-storage'

type Onboardable = 'SwapWidget' // add more onboard-able features here...

/**
 * Custom hook to manage onboarding state for specific features.
 *
 * This hook checks whether a feature has been onboarded by the user and provides a function
 * to mark the feature as onboarded. The onboarding state is persisted in localStorage.
 *
 * @param feature - The feature to check onboarding status for.
 * @returns A tuple containing:
 *  - `isOnboarded`: A boolean indicating if the feature has been onboarded.
 *  - `setAsOnboarded`: A function to mark the feature as onboarded.
 */
export const useOnboarding = (feature: Onboardable): [boolean, () => void] => {
  const [allOnboarded, setAllOnboarded] = useLocalStorage(
    'onboarded',
    {} as { [key in Onboardable]: boolean },
  )

  const isOnboarded = !!allOnboarded[feature]

  function setAsOnboarded() {
    setAllOnboarded({ ...allOnboarded, [feature]: true })
  }

  return [isOnboarded, setAsOnboarded]
}
