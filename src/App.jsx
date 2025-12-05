import React from 'react'
import Particles from './components/Particles'
import Header from './components/Header'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Solution from './components/Solution'
import Membership from './components/Membership'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-void text-white antialiased flex flex-col min-h-screen relative">
      <Particles />
      <Header />
      <main className="flex-grow relative z-10">
        <Hero />
        <Problem />
        <Solution />
        <Membership />
      </main>
      <Footer />
    </div>
  )
}

export default App

