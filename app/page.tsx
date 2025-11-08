'use client'

import { useEffect, useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import UsernameModal from '@/components/UsernameModal'

export default function Home() {
  const [username, setUsername] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(true)

  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername')
    if (savedUsername) {
      setUsername(savedUsername)
      setIsModalOpen(false)
    }
  }, [])

  const handleUsernameSubmit = (name: string) => {
    setUsername(name)
    localStorage.setItem('chatUsername', name)
    setIsModalOpen(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {isModalOpen ? (
        <UsernameModal onSubmit={handleUsernameSubmit} />
      ) : (
        <ChatInterface username={username!} />
      )}
    </main>
  )
}

