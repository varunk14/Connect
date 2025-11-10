'use client'

import { useAuth } from '@/contexts/AuthContext'
import ChatInterface from '@/components/ChatInterface'
import GoogleSignIn from '@/components/GoogleSignIn'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-white/30 border-t-white mb-4 md:mb-6"></div>
          <p className="text-white text-lg md:text-xl font-semibold">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="glass rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 max-w-md w-full mx-4 animate-fade-in backdrop-blur-xl border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <div className="text-5xl md:text-7xl mb-4 animate-bounce">💬</div>
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Welcome to Chat!
            </h2>
            <p className="text-gray-600 text-sm md:text-lg">
              Sign in with Google to start chatting with friends
            </p>
          </div>
          <GoogleSignIn />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ChatInterface user={user} />
    </main>
  )
}

