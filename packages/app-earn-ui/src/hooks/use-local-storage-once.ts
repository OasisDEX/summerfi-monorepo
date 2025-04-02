// Hook which allows you to set a value in LS and then
// read it once, after which it will be removed from LS

const LSOnceKey = 'earn-ui-once'

export const useLocalStorageOnce = <T>(params?: { key: string }) => {
  return {
    setStorageOnce: (value: T): void => {
      localStorage.setItem(params?.key ?? LSOnceKey, JSON.stringify(value))
    },
    getStorageOnce: (): T | null => {
      if (!localStorage.getItem(params?.key ?? LSOnceKey)) {
        return null
      }
      const value = JSON.parse(localStorage.getItem(params?.key ?? LSOnceKey) ?? 'null')

      localStorage.removeItem(params?.key ?? LSOnceKey)

      return value as T
    },
  }
}
