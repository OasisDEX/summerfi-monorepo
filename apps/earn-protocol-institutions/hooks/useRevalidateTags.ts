'use client'
import { useRouter } from 'next/navigation'

const fetchRevalidate = async ({ tags }: { tags: string[] }) => {
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags }),
  })
}

export const useRevalidateTags = () => {
  const { refresh: refreshView } = useRouter()

  const revalidateTags = ({ tags }: { tags: string[] }) => {
    fetchRevalidate({ tags }).then(() => {
      refreshView()
    })
  }

  return {
    revalidateTags,
  }
}
