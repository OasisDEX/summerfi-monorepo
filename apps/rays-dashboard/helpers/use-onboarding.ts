import { useLocalStorage } from '@/helpers/use-local-storage'

type Onboardable = 'SwapWidget' // add more onboardable features here...

export function useOnboarding(feature: Onboardable): [boolean, () => void] {
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
