'use client'

import { useEffect, useState, useRef } from 'react'
import { User } from 'firebase/auth'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import UserList from './UserList'
import { useAuth } from '@/contexts/AuthContext'
import {
  subscribeToMessages,
  subscribeToUsers,
  sendMessage as sendMessageToFirestore,
  setUserOnline,
  setUserOffline,
  Message,
} from '@/lib/firestore'

interface ChatInterfaceProps {
  user: User
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const { signOut } = useAuth()
  const username = user.displayName || user.email?.split('@')[0] || 'User'
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const previousUsersRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Set user as online
    setUserOnline(username)
    setIsConnected(true)

    // Subscribe to messages
    const unsubscribeMessages = subscribeToMessages((newMessages) => {
      setMessages(newMessages)
    })

    // Subscribe to users
    const unsubscribeUsers = subscribeToUsers((userList) => {
      const currentUsers = new Set(userList)
      const previousUsers = previousUsersRef.current

      // Detect new users joining
      userList.forEach((user) => {
        if (!previousUsers.has(user) && user !== username) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-join-${user}-${Date.now()}`,
              username: 'System',
              message: `${user} joined the chat`,
              timestamp: Date.now(),
            },
          ])
        }
      })

      // Detect users leaving
      previousUsers.forEach((user) => {
        if (!currentUsers.has(user) && user !== username) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-left-${user}-${Date.now()}`,
              username: 'System',
              message: `${user} left the chat`,
              timestamp: Date.now(),
            },
          ])
        }
      })

      previousUsersRef.current = currentUsers
      setUsers(userList)
    })

    // Cleanup on unmount
    return () => {
      unsubscribeMessages()
      unsubscribeUsers()
      setUserOffline(username)
      setIsConnected(false)
    }
  }, [username])

  // Handle page visibility change (set offline when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline(username)
      } else {
        setUserOnline(username)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Handle beforeunload (when user closes tab/window)
    const handleBeforeUnload = () => {
      setUserOffline(username)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [username])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    if (message.trim() && isConnected) {
      try {
        await sendMessageToFirestore(username, message)
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Failed to send message. Please try again.')
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with user list */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 border-r border-purple-400/20 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-6 border-b border-white/10 bg-gradient-to-br from-indigo-700/90 to-purple-700/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">💬 Chat</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/20 transition-all"
                title="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={signOut}
                className="text-white/90 hover:text-white text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}>
                {isConnected && (
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse"></div>
                )}
              </div>
            </div>
            <span className="text-sm text-white/90 font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            {user.photoURL ? (
              <div className="relative">
                <img
                  src={user.photoURL}
                  alt={username}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white/50 shadow-2xl object-cover ring-2 md:ring-4 ring-white/20"
                />
                <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 border-2 md:border-4 border-white/50 shadow-2xl flex items-center justify-center ring-2 md:ring-4 ring-white/20">
                  <span className="text-white font-bold text-lg md:text-2xl">
                    {username.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-bold text-white truncate">{username}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <UserList users={users} currentUser={username} />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Mobile header with menu button */}
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 border-b border-purple-400/20 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 rounded-lg hover:bg-white/20 transition-all"
            title="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-white drop-shadow-lg">💬 Chat</h1>
          <button
            onClick={signOut}
            className="text-white/90 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} currentUser={username} />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
      </div>
    </div>
  )
}

