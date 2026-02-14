'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Astral Research"
            width={120}
            height={50}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
            Home
          </Link>
          <Link href="/team" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
            Team
          </Link>
          <Link href="/careers" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
            Careers
          </Link>
          <a
            href="mailto:eurosafeai.zurich@gmail.com"
            className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/team"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/careers"
              className="text-sm font-medium text-gray-700 hover:text-blue-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <a
              href="mailto:eurosafeai.zurich@gmail.com"
              className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
