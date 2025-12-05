import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Mission from './components/Mission'
import ResourcesEvents from './components/ResourcesEvents'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Mission />
        <ResourcesEvents />
      </main>
      <Footer />
    </div>
  )
}

export default App

