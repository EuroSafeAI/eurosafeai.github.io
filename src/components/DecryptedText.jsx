import React, { useState, useEffect } from 'react'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

function DecryptedText({ text, className = '', speed = 50, onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [isDecrypting, setIsDecrypting] = useState(true)

  useEffect(() => {
    let currentIndex = 0
    let iteration = 0
    const maxIterations = text.length * 3 // Number of cycles before revealing final text

    const interval = setInterval(() => {
      if (iteration < maxIterations) {
        // Generate random characters
        const randomChars = text
          .split('')
          .map((char, index) => {
            if (index < currentIndex) {
              return text[index]
            }
            if (char === ' ') {
              return ' '
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')

        setDisplayText(randomChars)

        // Gradually reveal more characters
        if (iteration % 3 === 0 && currentIndex < text.length) {
          currentIndex++
        }

        iteration++
      } else {
        // Reveal final text
        setDisplayText(text)
        setIsDecrypting(false)
        if (onComplete) {
          onComplete()
        }
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      {isDecrypting && <span className="animate-pulse text-electric-cyan">|</span>}
    </span>
  )
}

export default DecryptedText

