import { BridgeForm } from '@/features/bridge/components/BridgeForm/BridgeForm'

const BridgePage = () => {
  return (
    <main className="min-h-screen bg-dark text-white flex justify-center">
      <section className="p-4 mt-4">
        <BridgeForm />
      </section>
    </main>
  )
}

export default BridgePage
