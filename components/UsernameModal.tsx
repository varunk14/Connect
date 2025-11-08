'use client'

import { useState, FormEvent } from 'react'

interface UsernameModalProps {
  onSubmit: (username: string) => void
}

export default function UsernameModal({ onSubmit }: UsernameModalProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedUsername = username.trim()
    
    if (!trimmedUsername) {
      setError('Please enter a username')
      return
    }
    
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    
    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters')
      return
    }

    setError('')
    onSubmit(trimmedUsername)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome to Chat! 💬
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your username to start chatting
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setError('')
            }}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-lg"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  )
}

