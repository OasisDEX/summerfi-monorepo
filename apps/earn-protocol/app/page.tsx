import { Form } from '@/components/organisms/Form/Form'

export default function HomePage() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>Overview</div>
        <Form />
      </div>
    </div>
  )
}