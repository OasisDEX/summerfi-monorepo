import dynamic from 'next/dynamic'

const AccountKitFeatures = dynamic(
  () => import('@/components/organisms/AccountKitFeatures/AccountKitFeatures'),
  {
    ssr: false,
  },
)

const Form = dynamic(() => import('@/components/organisms/Form/Form'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <AccountKitFeatures />
        </div>
        <Form />
      </div>
    </div>
  )
}
