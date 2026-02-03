import { useCallback, useEffect, useRef, useState } from 'react'

import { authFetchMe } from '@/contexts/AuthContext/helpers'

type AuthMeResponse = Awaited<ReturnType<typeof authFetchMe>>

export const useInstitutionUser = () => {
  const abortRef = useRef<AbortController | null>(null)
  const [data, setData] = useState<AuthMeResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const redirectHome = () => {
    window.location.replace('/')
  }

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const fetchUser = useCallback(() => {
    cancel()

    const controller = new AbortController()

    abortRef.current = controller
    setLoading(true)

    authFetchMe({ signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return

        if (!response.user) {
          redirectHome()

          return
        }

        setData(response)
      })
      .catch((error) => {
        if (controller.signal.aborted) return

        const { status: statusCode } = error as { status?: number }

        if (statusCode === 401) {
          redirectHome()
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })
  }, [cancel])

  useEffect(() => {
    fetchUser()

    return cancel
  }, [cancel, fetchUser])

  return { data, loading, refetch: fetchUser, cancel }
}
