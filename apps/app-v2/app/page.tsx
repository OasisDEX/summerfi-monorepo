'use client'

import { useRef } from 'react'
import { ButtonExample, Text, TitleExample } from '@summerfi/app-ui'

export default function HomePage() {
  const ref = useRef<HTMLElement>(null)

  return (
    <div>
      <Text>Text component</Text>
      <Text as="p">Text component as p</Text>
      <Text as="p" variant="p1">
        Text component as p with p1 variant
      </Text>
      <Text as="p" variant="p1" style={{ color: 'var(--color-text-interactive' }}>
        Text component as p with p1 variant and inline styles
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{ color: 'var(--color-text-interactive' }}
        className="extra-class"
      >
        Text component as p with p1 variant, inline styles and additional class (check in devtools)
      </Text>
    </div>
  )
}
