import React from 'react'

// TODO: Ensure that BridgeForm is implemented and exported from @app-earn-ui.
// For now, this imports what will become your bridging form.
import { BridgeForm } from '@/features/bridge/components/BridgeForm/BridgeForm'

const BridgePage = () => {
  return (
    <main className="min-h-screen bg-dark text-white">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Bridge SUMR Tokens</h1>
      </header>
      <section className="p-4">
        {/* Placeholder for the BridgeForm component */}
        <BridgeForm />
      </section>
    </main>
  )
}

export default BridgePage
