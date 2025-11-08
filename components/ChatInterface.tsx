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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with user list */}
      <div className="w-72 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 border-r border-purple-400/20 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-indigo-700/90 to-purple-700/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">💬 Chat</h1>
            <button
              onClick={signOut}
              className="text-white/90 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
              title="Sign out"
            >
              Sign Out
            </button>
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
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            {user.photoURL ? (
              <div className="relative">
                <img
                  src={user.photoURL}
                  alt={username}
                  className="w-14 h-14 rounded-full border-4 border-white/50 shadow-2xl object-cover ring-4 ring-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 border-4 border-white/50 shadow-2xl flex items-center justify-center ring-4 ring-white/20">
                  <span className="text-white font-bold text-2xl">
                    {username.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate">{username}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <UserList users={users} currentUser={username} />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} currentUser={username} />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
      </div>
    </div>
  )
}

